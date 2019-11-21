const dbHelper = require('../helpers/db')
const db = new dbHelper();

exports.all = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM scrapes LIMIT 10', (error, results, fields) => {
            if (error) {
                reject(error);
            }
            // console.log(results);
            resolve(results, fields)
        });
    })
}

exports.add = ({ service, content }) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO \`scrapes\` (\`service\`, \`content\`)` +
            `VALUES ('${service}', '${content}')`, (error, results, fields) => {
                if (error) {
                    reject(error);
                }
                // console.log(results);
                resolve(results, fields);
            });
    });
}
