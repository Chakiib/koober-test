"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = void 0;
const fs = require('fs');
const read = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data.toString());
        });
    });
};
exports.read = read;
