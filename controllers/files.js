const express = require("express");
const router = express.Router();

const FileModel = require("../models/file");

const {
  models: { File }
} = require("../database");

router.get("/dates", (req, res) => {
  FileModel.getLastDates(null, 48).then(dates => {
    res.json(dates.map(d => d.date));
  });
});

router.post("/fromDates", (req, res) => {
  const fileVersions = {};
  FileModel.getFilesFromDates(null, req.body).then(files => {
    files.forEach(file => {
      if (file.date in fileVersions) {
        fileVersions[file.date].push({
          name: file.name,
          lines: JSON.parse(file.lines)
        });
      } else {
        fileVersions[file.date] = [
          {
            name: file.name,
            lines: JSON.parse(file.lines)
          }
        ];
      }
    });
    res.json(fileVersions);
  });
});

router.post("/migrate", (req, res) => {
  if (req.body.what == 42) {
    File.findAll().then(files => {
      files.forEach(file => {
        var day = file.name.match(regex);
        if (day.length == 1) {
          File.update(
            {
              day: day[0]
            },
            { where: { id: file.id } }
          );
        }
      });
    });
    return;
  }
  res.send("NOT OK");
});

module.exports = router;
