require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3001;
const schedule = require("node-schedule");
const Scraper = require("./helpers/scraper");
const fs = require("fs");
const cors = require("cors");

const notifier = require("./helpers/notifier");

app.use(cors());

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("./controllers"));
app.listen(port, () => console.log(`Listening on port ${port}`));

const notifierObj = new notifier();

const disabledScrape = false;
// const disabledScrape = true;

const disabledCheck = false;
// const disabledCheck = true;

(async () => {

  if (!disabledScrape) {
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
      console.log("Running", new Date());
      await scraperOne.scrape();
      await scraperTwo.scrape();
    });
  }

  schedule.scheduleJob(process.env.CRON_CHECK, async () => {
    if (disabledCheck) return;
    console.log("Checking", new Date());

    notifierObj.check();
  });
})();
