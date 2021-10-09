import { JsonData, OutputType, CartType, ArticleType } from './types';

/**
 * Calculate an article total price
 * The promise will be rejected in case we pass an articleId that isn't present in the articles list
 */
const getArticleTotal = (articleId: number, quantity: number, articles: ArticleType[]): Promise<number> => {
    return new Promise((resolve, reject) => {
        const article = articles.find((article) => article.id === articleId);

        if (!article) reject("The article isn't present in the articles list");
        else resolve(article.price * quantity);
    });
};

const sumCartPrices = async (cart: CartType, articles: ArticleType[]): Promise<number> => {
    return await cart.items.reduce(async (a, b) => {
        const sumA = await a;
        const sumB = await getArticleTotal(b.article_id, b.quantity, articles);

        return sumA + sumB;
    }, Promise.resolve(0));
};

export const getCartTotals = async (data: JsonData): Promise<OutputType> => {
    const { articles, carts } = data;
    const calculatedCart: OutputType = { carts: [] };

    for (const cart of carts) {
        calculatedCart.carts.push({
            id: cart.id,
            total: await sumCartPrices(cart, articles),
        });
    }

    return calculatedCart;
};
