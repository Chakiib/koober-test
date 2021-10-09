import { JsonData, OutputType } from './types';

export const getCartTotals = async (data: JsonData) => {
    const { articles, carts } = data;
    const calculatedCart: OutputType = { carts: [] };
};
