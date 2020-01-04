'use strict';

const Sequelize = require('sequelize');

const connection = new Sequelize(
    process.env.DB_DB,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mariadb',
    }
);

const definitions = require('./definitions');
const models = {};
for (const name in definitions) {
    models[name] = connection.define(name, definitions[name]);
}
const sync = () => {
    connection.sync()
}

module.exports = {
    connection, models, sync
};
