"use strict";

const DataTypes = require("sequelize");

module.exports = {
  client: {
    type: DataTypes.INTEGER,
    unique: "clientDate"
  },
  date: {
    type: DataTypes.STRING(20),
    unique: "clientDate"
  },
  values: DataTypes.TEXT
};
