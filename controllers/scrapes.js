const express = require('express');
const router = express.Router()

const Scrape = require('../models/scrape')

const fs = require('fs');

router.get('/', (req, res) => {
  Scrape.all().then(scrapes => {
    res.json(scrapes.map(s => {
      return {
        ...s,
        content: JSON.parse(s.content.replace(/\n/g, "\\n")),
      }
    }));
  })
});

module.exports = router
