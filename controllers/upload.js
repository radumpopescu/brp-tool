const express = require("express");
const router = express.Router();
const path = require("path");
const parseCSV = require("../helpers/parseCSV");

const formidable = require("formidable");
// const folder = path.join(__dirname, "upload");
const folder = path.join(path.dirname(require.main.filename), "upload");
const {
  models: { Value }
} = require("../database");

router.post("/", (req, res) => {
  const form = new formidable.IncomingForm();

  form.uploadDir = folder;
  form.parse(req, (_, fields, files) => {
    const fileNames = Object.keys(files);
    const file = files[fileNames[0]];
    const csvObj = new parseCSV(file.path);
    csvObj.getParsedFile().then(csv => {
      res.json(csv);
    });
  });
});

router.put("/", (req, res) => {
  const { service, code, name, xml_name, platform_id } = req.body;
  Client.create({ service, code, name, xml_name, platform_id }).then(client => {
    res.json(client);
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Client.destroy({
    where: { id }
  }).then(result => {
    res.json(result);
  });
});

module.exports = router;
