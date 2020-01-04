'use strict';

const DataTypes = require('sequelize');

module.exports = {
    service: DataTypes.STRING(20),
    content: DataTypes.TEXT,
};
