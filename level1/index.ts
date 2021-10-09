import { JsonData } from './types';

const main = async () => {
    const { read } = require('./fileManager');

    try {
        const data = await read('input.json');
        const inputData: JsonData = JSON.parse(data);

        const { getCartTotals } = require('./cartManager');
        const calculatedCarts = await getCartTotals(inputData);

        try {
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.error(err);
    }
};

if (require.main === module) {
    main();
}
