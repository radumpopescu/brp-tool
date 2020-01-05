const express = require("express");
const router = express.Router();

const {
  models: { Client }
} = require("../database");

router.get("/", (req, res) => {
  Client.findAll().then(clients => {
    res.json(clients);
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
