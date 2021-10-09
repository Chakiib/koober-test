import { JsonData } from './types';

const main = async () => {
    const { read } = require('./fileManager');

    try {
        const data = await read('input.json');
        const inputData: JsonData = JSON.parse(data);
    } catch (error) {}
};

if (require.main === module) {
    main();
}
