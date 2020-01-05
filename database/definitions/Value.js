'use strict';

const DataTypes = require('sequelize');

module.exports = {
    client: DataTypes.INTEGER,
    date: DataTypes.STRING(20),
    values: DataTypes.TEXT,
};
