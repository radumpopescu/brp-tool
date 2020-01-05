'use strict';

const DataTypes = require('sequelize');

module.exports = {
    service: DataTypes.STRING(20),
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    xml_name: DataTypes.STRING,
    platform_id: DataTypes.STRING,
};
