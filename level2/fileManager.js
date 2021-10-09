"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = exports.read = void 0;
const fs = require('fs');
const read = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT')
                    reject('File not found!');
                else
                    reject(err);
            }
            else {
                resolve(data.toString());
            }
        });
    });
};
exports.read = read;
const write = (fileName, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, 'utf8', (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
};
exports.write = write;
