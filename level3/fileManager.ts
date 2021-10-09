const fs = require('fs');

export const read = (fileName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err: NodeJS.ErrnoException | null, data: Buffer) => {
            if (err) {
                if (err.code === 'ENOENT') reject('File not found!');
                else reject(err);
            } else {
                resolve(data.toString());
            }
        });
    });
};

export const write = (fileName: string, data: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, 'utf8', (err: NodeJS.ErrnoException | null) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
};
