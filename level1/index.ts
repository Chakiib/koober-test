import { JsonData } from './types';

const main = async () => {
    const { read, write } = require('./fileManager');

    try {
        const data = await read('input.json');
        const inputData: JsonData = JSON.parse(data);

        const { Cart } = require('./cart');
        const cart = new Cart(inputData);

        const calculatedCarts = await cart.calculate(inputData);

        try {
            await write('output.json', JSON.stringify(calculatedCarts, null, 2));
        } catch (err) {
            console.error(err);
        }
    } catch (err) {
        console.error(err);
    }
};

if (require.main === module) {
    main();
}
