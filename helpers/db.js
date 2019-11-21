const mysql = require('mysql');

class db {
    constructor() {
        if (!!db.instance) {
            return db.instance;
        }
        db.instance = this;

        this.init();

        return this;
    }

    init() {

        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DB,
        });

        this.connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                setTimeout(this.init, 100);
            }

            console.log(`${new Date()} Mysql connected [${this.connection.threadId}]`);
        });

        this.connection.on('error', (err) => {
            console.log('db error', err);

            if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                this.init();                         // lost due to either server restart, or a
            } else {                                      // connnection idle timeout (the wait_timeout
                throw err;                                  // server variable configures this)
            }
        });

    }

    query(...args) {
        return this.connection.query(...args);
    }

    destroy() {
        this.connection.end();
    }
}

module.exports = db
