const express = require('express');
const router = express.Router()

const File = require('../models/file')

router.get('/dates', (req, res) => {
    File.getLastDates(process.env.SERVICE_ONE, 48).then(dates => {
        res.json(dates.map(d => d.date));
    });
});

router.post('/fromDates', (req, res) => {
    const fileVersions = {};
    File.getFilesFromDates(process.env.SERVICE_ONE, req.body).then(files => {
        files.forEach(file => {
            if (file.date in fileVersions) {
                fileVersions[file.date].push({
                    name: file.name,
                    lines: JSON.parse(file.lines),
                })
            } else {
                fileVersions[file.date] = [{
                    name: file.name,
                    lines: JSON.parse(file.lines),
                }];
            }
        });
        res.json(fileVersions);
    });
});

module.exports = router
