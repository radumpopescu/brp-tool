const dbHelper = require('../helpers/db')
const db = new dbHelper();

// exports.getLast2 = (service) => {
//     return new Promise((resolve, reject) => {
//         db.query(`SELECT * FROM \`scrapes\` WHERE \`service\`='${service}' ORDER BY \`id\` DESC LIMIT 2`, (error, results, fields) => {
//             if (error) {
//                 reject(error);
//             }

//             // if (results.length) {
//             //     console.log(results);
//             //     resolve(JSON.parse(results[0].content));
//             // }
//             resolve(results, fields)
//         });
//     })
// }

exports.getLastDates = (service, number) => {
    if (!number) {
        number = 2;
    }
    return new Promise((resolve, reject) => {
        let values = [];
        if (service != null) {
            values.push(service);
        }
        values.push(number);

        db.query(
            'SELECT DISTINCT `date`' +
            ' FROM `files`' +
            (service !== null ? ' WHERE `service` = ?' : '') +
            ' ORDER BY DATE DESC LIMIT ?', values, (error, results, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(JSON.stringify(results)), fields)
            });
    })
}

exports.getFilesFromDates = (service, dates) => {

    return new Promise((resolve, reject) => {
        let values = [dates];
        if (service != null) {
            values.push(service);
        }
        db.query(
            'SELECT *' +
            'FROM `files`' +
            'WHERE `date` in (?)' + (service !== null ? ' AND `service` = ?' : '') +
            'ORDER BY name', values, (error, results, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(JSON.stringify(results)), fields)
            });
    })
}

// exports.all = () => {
//     return new Promise((resolve, reject) => {
//         db.query('SELECT * FROM scrapes LIMIT 10', (error, results, fields) => {
//             if (error) {
//                 reject(error);
//             }
//             // console.log(results);
//             resolve(results, fields)
//         });
//     })
// }

// Get all comments by a particular user
exports.add = ({ service, name, date, lines }) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO \`files\` (\`service\`, \`name\`, \`date\`, \`lines\`)` +
            `VALUES (?, ?, ?, ?)`, [service, name, date, lines], (error, results, fields) => {
                if (error) {
                    reject(error);
                }
                // console.log(results);
                resolve(results, fields);
            });
    });
}
