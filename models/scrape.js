const { models: { Scrape } } = require('../database');

exports.all = () => {
    return Scrape.findAll({
        limit: 10
    });
}

exports.add = ({ service, content }) => {
    return Scrape.create({ service, content });
}
