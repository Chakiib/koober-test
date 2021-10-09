import { JsonData, OutputType, CartType, ArticleType } from './types';

const sumCartPrices = async (cart: CartType, articles: ArticleType[]): Promise<number> => {
    return await cart.items.reduce(async (a, b) => {
        const sumA = await a;
        const sumB = await a;

        return sumA + sumB;
    }, Promise.resolve(0));
};

export const getCartTotals = async (data: JsonData) => {
    const { articles, carts } = data;
    const calculatedCart: OutputType = { carts: [] };

    for (const cart of carts) {
        calculatedCart.carts.push({
            id: cart.id,
            total: 0,
        });
    }
};
