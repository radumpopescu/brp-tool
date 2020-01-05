"use strict";

const DataTypes = require("sequelize");

module.exports = {
  service: DataTypes.STRING(20),
  day: DataTypes.STRING(20),
  date: DataTypes.STRING(20),
  name: DataTypes.STRING,
  lines: DataTypes.TEXT
};
