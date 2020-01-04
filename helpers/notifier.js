const moment = require('moment-timezone');
const diff = require("./diff");

const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}

const reflect = promise => {
    return promise.then(
        () => {
            return [];
        },
        errors => {
            return errors;
        }
    );
};

class notifier {
    constructor() {
        this.sgMail = require('@sendgrid/mail');
        this.sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        this.diffObj = new diff();

        this.twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    }

    sendMail({ to, subject, body }) {
        if (!to) {
            return;
        }
        if (!subject) {
            subject = 'Notificare';
        }
        const msg = {
            to,
            from: process.env.MAIL_FROM,
            subject,
            html: body,
        };
        this.sgMail.send(msg).catch((error) => {
            console.log('Error sending mail: ' + error.message);
        });

    }

    call(number) {
        this.twilioClient.calls
            .create({
                url: 'http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient',
                to: number,
                from: process.env.TWILIO_NUMBER
            })
            .then(call => console.log(`Call made ${call.sid}`));
    }

    check() {
        Promise.all([
            this.diffObj.check(process.env.SERVICE_ONE),
            this.diffObj.check(process.env.SERVICE_TWO),
        ].map(reflect)).then((results) => {
            // Magic flattening of the array of arrays
            const errors = [].concat.apply([], results);
            if (errors.length) {
                console.log('Differences found', JSON.stringify(errors));
                if (notifier.shouldNotify(errors)) {
                    const emails = JSON.parse(process.env.NOTIFY_EMAILS);
                    emails.forEach(email => {
                        this.sendMail({
                            to: email,
                            subject: 'Alerta Intraday!!!!!!',
                            body: notifier.generate(errors)
                        })
                    });
                    this.call(`4${process.env.NOTIFY_PHONE}`);
                } else {
                    // @TODO add to a db queue
                    console.log('Not notifying because nothing urgent happened')
                }
            } else {
                console.log('All good')
            }
        })
    }

    static shouldNotify(differences) {
        const t = moment().tz("Europe/Bucharest");
        const hourNow = t.format('H');

        if (hourNow > 7) {
            return true;
        }
        const dateNow = t.format('YYYY-MM-DD');

        return differences.some(d => {
            return d.file.includes(dateNow) && d.hour < 11;
        })
    }

    static generate(errors) {
        const files = {};
        errors.forEach(e => {
            if (!(e['file'] in files)) {
                files[e['file']] = {};
            }
            if (!(e['line'] in files[e['file']])) {
                files[e['file']][e['line']] = [];
            }
            files[e['file']][e['line']].push(e['hour']);
        })

        let mail = '<div style="font-size: 24px">Au aparut diferente.</div>' +
            '<div style="font-size: 18px">Mai multe detalii aici: <a href="http://brp.popescu.xyz"><b>http://brp.popescu.xyz</b></a></div>' +
            '<div style="font-size: 14px">Pentru a functiona corect, folositi Google Chrome</div>';
        Object.keys(files).forEach(name => {
            mail += `<br/><b>${name}</b><br/>` +
                '<ul>';
            Object.keys(files[name]).forEach(comp => {
                const hours = files[name][comp].filter(onlyUnique).map(h => h + 1);
                mail += `<li><b>${comp}</b> (`;
                if (hours.length == 24) {
                    mail += 'toata ziua';
                } else {
                    mail += (hours.length > 1 ? 'orele ' : 'ora ');
                    mail += hours.join(', ');
                }
                mail += ')</li>';
            })
            mail += '</ul>';
        })

        return mail;
    }
}

module.exports = notifier
