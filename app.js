require('dotenv').config();

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const schedule = require('node-schedule')
const Scraper = require('./helpers/scraper')
const fs = require('fs')
const cors = require('cors')
const request = require('request')
const diff = require('./helpers/diff')


app.use(cors())

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('./controllers'))
app.listen(port, () => console.log(`Listening on port ${port}`));

const diffObj = new diff();

const disabled = false;
// const disabled = true;

(async () => {
  const scraperOne = new Scraper();
  scraperOne.service = process.env.SERVICE_ONE;
  scraperOne.cert = fs.readFileSync(`cert/${scraperOne.service}.cert`);
  scraperOne.key = fs.readFileSync(`cert/${scraperOne.service}.decrypt.key`);
  await scraperOne.initialize();

  const scraperTwo = new Scraper();
  scraperTwo.service = process.env.SERVICE_TWO;
  scraperTwo.cert = fs.readFileSync(`cert/${scraperTwo.service}.cert`);
  scraperTwo.key = fs.readFileSync(`cert/${scraperTwo.service}.decrypt.key`);
  await scraperTwo.initialize();

  schedule.scheduleJob(process.env.CRON_SCRAPE, async () => {
    if (disabled) return;
    console.log("Running", new Date());
    await scraperOne.scrape();
    await scraperTwo.scrape();
  });
  schedule.scheduleJob(process.env.CRON_CHECK, async () => {
    if (disabled) return;
    console.log("Checking", new Date());
    diffObj.check().then(() => {
      console.log('ok');
    }).catch((err) => {
      console.log('err', JSON.stringify(err));
      request.post(process.env.NOTIFY_URL,
        {
          form: {
            theAnswerToLifeTheUniverseAndEverything: 42,
            errors: err,
          }
        }, (err, res, body) => {
          console.log(body);
        })
    })
  });
})();
