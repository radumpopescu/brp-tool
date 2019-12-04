'use strict';

const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');
const Base64 = require('js-base64').Base64;
const moment = require('moment-timezone');


// const Cookie = require('../models/cookie')
const Scrape = require('../models/scrape')
const File = require('../models/file')

class Scraper {

    async initialize() {
        console.log(`Initialising ${this.service}`);

        this.jar = request.jar();

        this.browser = await puppeteer.launch({
            // headless: false,
            args: ['--no-sandbox'],
        });

        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1242 });
        await this.page.setRequestInterception(true);

        this.page.on('request', interceptedRequest => {
            // Intercept Request, pull out request options, add in client cert
            const options = {
                uri: interceptedRequest.url(),
                method: interceptedRequest.method(),
                headers: interceptedRequest.headers(),
                body: interceptedRequest.postData(),
                cert: this.cert,
                key: this.key,
                jar: this.jar,
            }

            // Fire off the request manually (example is using using 'request' lib)
            request(options, function (err, resp, body) {
                // Abort interceptedRequest on error
                if (err) {
                    console.error(`Unable to call ${options.uri}`, err);
                    return interceptedRequest.abort('connectionrefused');
                }

                // Return retrieved response to interceptedRequest
                interceptedRequest.respond({
                    status: resp.statusCode,
                    contentType: resp.headers['content-type'],
                    headers: resp.headers,
                    body: body
                });
            });
        });
    }

    constructor() {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }

    async scrape() {

        // await Cookie.get(this.service).then(cookies => {
        //     console.log(cookies);
        //     if (cookies.length !== 0) {
        //         for (let cookie of cookies) {
        //             this.page.setCookie(cookie)
        //         }
        //         console.log('Session has been loaded in the browser')
        //     }
        // })
        await this.page.goto(process.env.SITE_URL);

        let selector = '#loginFormContent > div:nth-child(6) > input[type=password]';
        // If login present
        if (await this.page.$(selector) !== null) {
            // await this.page.screenshot({ path: `screenshots/login-${this.service}-${Date.now()}.png` });
            console.log(`Logging in ${this.service}`);
            let password = process.env.SITE_PASSWORD;
            await this.page.evaluate((selector, password) => {
                document.querySelector(selector).value = password;
            }, selector, password);

            selector = '#loginFormContent > div.floatLeft > button';
            await this.page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, selector);
        } else {
            console.log(`AlreadyLoggedIn ${this.service}`)
        }
        await this.page.waitFor(1000);
        await this.page.screenshot({ path: `screenshots/${moment().format('YYYY-MM-DD HH:mm')}-${this.service}.png` });
        const files = await this.page.evaluate(() => {
            const trs = Array.from(document.querySelectorAll('table tr'))

            return trs.reduce((acc, tr) => {
                const time = tr.children[5].innerText;
                const timeTest = /[\d:\d]$/;
                const validTime = timeTest.test(time);

                // Table header doesn't have a valid time
                if (!validTime) {
                    return acc;
                }

                const date = tr.children[4].innerText

                const dimension = tr.children[3].innerText
                // Folders don't have a dimension
                if (!dimension) {
                    return acc;
                }

                const file = tr.children[2].querySelector('a');

                const fileName = file.innerText;
                const extension = fileName.split('.').slice(-1)[0];

                // Ignore lines that don't contain csv
                // if (extension != 'csv') {
                //     return acc;
                // }

                acc.push({
                    date,
                    time,
                    dimension,
                    fileName,
                    extension,
                    fileUrl: file.href,
                });

                return acc;
            }, []);
        });

        this.downloadFiles(files).then((csvFiles) => {
            csvFiles = csvFiles.map(Scraper.processCsvFile);
            Scrape.add({
                service: this.service,
                content: JSON.stringify(csvFiles.map((csvObj) => {
                    return {
                        ...csvObj,
                        csv: Base64.encode(csvObj.csv),
                    }
                }))
            });

            csvFiles.forEach(file => {
                const date = moment().tz("Europe/Bucharest").format('YYYY-MM-DD HH:05:00');

                File.add({
                    service: this.service,
                    name: file.name,
                    date,
                    lines: JSON.stringify(file.lines),
                })
            });

            switch (this.service) {
                case process.env.SERVICE_ONE:
                    request.get(process.env.CHECK_URL_ONE);
                    break;
                case process.env.SERVICE_TWO:
                    request.get(process.env.CHECK_URL_TWO);
                    break;
            }
        });
        return 'ok';
    }

    downloadFiles(files) {
        return new Promise((resolve, reject) => {
            const t = moment().tz("Europe/Bucharest");

            const dates = [
                t.format('YYYY-MM-DD'),
                t.add(1, 'days').format('YYYY-MM-DD'),
                t.add(1, 'days').format('YYYY-MM-DD'),
                t.add(1, 'days').format('YYYY-MM-DD'),
                t.add(1, 'days').format('YYYY-MM-DD'),
            ];

            const hour = t.format('HH');
            const previousHour = t.subtract(1, 'hours').format('HH');
            const times = [];

            for (let i = 45; i <= 59; i++) {
                times.push(`${previousHour}:${i}`);
            }

            for (let i = 0; i <= 6; i++) {
                times.push(`${hour}:0${i}`);
            }

            const filteredFiles = files.filter(f => {
                return (
                    f.extension == 'csv' &&
                    dates.some(date => {
                        return f.fileName.includes(date);
                    }) &&
                    times.some(time => {
                        return f.time == time;
                    })
                );
            });

            const csvs = [];

            const promises = filteredFiles.map(f => {
                return new Promise((resolve, reject) => {
                    request({
                        cert: this.cert,
                        key: this.key,
                        jar: this.jar,
                        uri: f.fileUrl,
                        encoding: null,
                        gzim: false,
                    }, () => {
                        resolve();
                    })
                        .on('error', () => { })
                        .on('data', function (data) {
                            const foundIndex = csvs.findIndex(r => r.name == f.fileName);
                            if (foundIndex != -1) {
                                csvs[foundIndex].csv += data.toString();
                            } else {
                                csvs.push({
                                    name: f.fileName,
                                    date: f.date,
                                    time: f.time,
                                    dimension: f.dimension,
                                    csv: data.toString(),
                                })
                            }
                        })
                });

            })
            Promise.all(promises).then(() => {
                resolve(csvs);
            })
        });
    }

    async close() {
        await this.browser.close();
    }

    static processSummaryLine(line) {
        const nameRegex = /(.+):/;
        let name = line.match(nameRegex);
        const hours = line.split(' ,');
        hours.shift();
        const obj = {
            // line,
            name: name[1],
            hours,
        };
        return obj;
    }

    static processCsvFile(file) {
        const { csv } = file;
        const summaryRegex = /Summary:.+\n/;
        let foundIndex = csv.search(summaryRegex);

        const summaryContent = csv.substr(foundIndex);

        const lines = summaryContent.split('\n').filter(l => {
            if (l == '') return false;
            const nameRegex = /(.+):/;
            let name = l.match(nameRegex);
            return name != null;
        });
        lines.shift();
        lines.shift();
        file.lines = lines.reduce((acc, line) => {
            const expandedLine = Scraper.processSummaryLine(line);
            acc[expandedLine.name] = expandedLine.hours;
            return acc;
        }, {});

        return file;
    }

}
module.exports = Scraper
