const Sequelize = require('sequelize');

const { models: { File } } = require('../database');

exports.getLastDates = (service, limit) => {
    if (!limit) {
        limit = 2;
    }

    return File.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('date')), 'date'],
        ],
        where: service !== null ? { service } : {},
        order: [
            ['date', 'DESC'],
        ],
        limit,
    });
}

exports.getFilesFromDates = (service, dates) => {
    const where = {
        date: {
            [Sequelize.Op.in]: dates,
        }
    }
    if (service !== null) {
        where['service'] = service;
    }

    return File.findAll({
        where,
        order: [
            ['name', 'ASC'],
        ],
    });
}

exports.add = ({ service, date, name, lines }) => {
    return File.create({ service, date, name, lines });
}
