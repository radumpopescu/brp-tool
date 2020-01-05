const Sequelize = require("sequelize");

const {
  models: { File }
} = require("../database");

exports.getLastDates = (service, limit) => {
  if (!limit) {
    limit = 2;
  }

  return File.findAll({
    attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("date")), "date"]],
    where: service !== null ? { service } : {},
    order: [["date", "DESC"]],
    limit
  });
};

exports.getFilesFromDates = (service, dates) => {
  const where = {
    date: {
      [Sequelize.Op.in]: dates
    }
  };
  if (service !== null) {
    where["service"] = service;
  }

  return File.findAll({
    where,
    order: [["name", "ASC"]]
  });
};

exports.add = ({ service, date, name, lines }) => {
  const regex = /(\d{4}-\d{2}-\d{2})/g;
  var day = file.name.match(regex);
  if (day.length == 1) {
    return File.create({ service, day: day[0], date, name, lines });
  } else {
    // Should raise an error
    return File.create({ service, date, name, lines });
  }
};
