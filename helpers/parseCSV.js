const parse = require("csv-parse");
const assert = require("assert");
var fs = require("fs");

class parseCSV {
  constructor(file) {
    this.file = fs.readFileSync(file, "utf8");
  }

  getFileContent() {
    return this.file;
  }

  parseClients(rawData) {
    return new Promise((resolve, reject) => {
      const header = rawData[0];
      const clients = header.reduce((acc, client, clientIndex) => {
        if (client.length) {
          const obj = {
            index: clientIndex,
            name: client,
            values: []
          };
          rawData.forEach((line, lineIndex) => {
            if (lineIndex == 0) {
              return;
            }
            obj.values.push(parseInt(line[clientIndex]));
          });

          acc.push(obj);
        }
        return acc;
      }, []);
      resolve(clients);
    });
  }

  getParsedFile(callback) {
    return new Promise((resolve, reject) => {
      parse(this.file, {}, (err, output) => {
        this.parseClients(output).then(parsedData => {
          resolve(parsedData);
        });
      });
    });
  }
}

module.exports = parseCSV;
