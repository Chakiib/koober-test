const fs = require('fs');

export const read = (fileName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err: NodeJS.ErrnoException | null, data: Buffer) => {
            if (err) reject(err);
            else resolve(data.toString());
        });
    });
};
