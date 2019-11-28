const File = require('../models/file')

class diff {
    check(service) {
        return new Promise((resolve, reject) => {
            File.getLastDates(service, 2).then(dates => {
                dates = dates.map(d => d.date);
                if (dates.length < 2) {
                    console.log("Only one version present. Can't do it");
                    return;
                }
                const fileVersions = {};
                File.getFilesFromDates(service, dates)
                    .then((files) => {
                        files.forEach(file => {
                            if (file.date in fileVersions) {
                                fileVersions[file.date].push({
                                    name: file.name,
                                    lines: JSON.parse(file.lines),
                                })
                            } else {
                                fileVersions[file.date] = [{
                                    name: file.name,
                                    lines: JSON.parse(file.lines),
                                }];
                            }
                        });
                        const currentFiles = fileVersions[dates[0]];
                        const previousFiles = fileVersions[dates[1]];
                        const currentValue = (fileName, line, hourIndex) => {
                            const file = currentFiles.find(f => f.name == fileName);
                            if (!file) {
                                return;
                            }
                            return parseFloat(file.lines[line][hourIndex]);
                        }
                        const previousValue = (fileName, line, hourIndex) => {
                            const file = previousFiles.find(f => f.name == fileName);
                            if (!file || !(line in file.lines)) {
                                return;
                            }
                            return parseFloat(file.lines[line][hourIndex]);
                        }
                        const difference = (fileName, line, hourIndex) => {
                            const pv = previousValue(fileName, line, hourIndex);
                            if (undefined === pv) {
                                return true;
                            }
                            return pv != currentValue(fileName, line, hourIndex);
                        }
                        const errors = [];
                        currentFiles.forEach(file => {
                            Object.keys(file.lines).forEach(lineName => {
                                for (let i = 0; i < 24; i++) {
                                    if (difference(file.name, lineName, i)) {
                                        // console.log('diff', file.name, lineName, i, 'because', previousValue(file.name, lineName, i), currentValue(file.name, lineName, i));
                                        errors.push({
                                            file: file.name,
                                            line: lineName,
                                            hour: i,
                                        })
                                    }
                                }
                            })
                        })
                        if (errors.length) {
                            reject(errors);
                        } else {
                            resolve();
                        }

                    });
            })
        });
    }
}

module.exports = diff
