const express = require("express");
const router = express.Router();

const {
  models: { Value, Client }
} = require("../database");

const addValue = data => {
  return new Promise((resolve, reject) => {
    Value.upsert(data).then(resolve);
  });
};

router.get("/", (req, res) => {
  Value.findAll().then(values => {
    const dates = {};
    values.forEach(val => {
      if (!(val["date"] in dates)) {
        dates[val["date"]] = [];
      }
      val.values = val.values.split(",");
      dates[val["date"]].push(val);
    });
    res.json(dates);
  });
});

router.put("/", (req, res) => {
  const { clients, date } = req.body;
  clients.forEach(clientData => {
    if (clientData.client) {
      return;
      addValue({
        client: clientData.client.id,
        values: clientData.values.join(),
        date
      });
    } else {
      const newClientData = {};
      if (/^[A-Z]+$/.test(clientData.name)) {
        newClientData.code = clientData.name;
      } else {
        newClientData.name = clientData.name;
      }
      Client.create(newClientData).then(newClient => {
        addValue({
          client: newClient.id,
          values: clientData.values.join(),
          date
        });
      });
    }
  });
  res.send("ok");
});

module.exports = router;
