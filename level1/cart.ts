import { ArticleType, CartType, JsonData, OutputType } from './types';

export class Cart {
    articles: ArticleType[];
    carts: CartType[];

    constructor(data: JsonData) {
        this.articles = data.articles;
        this.carts = data.carts;
    }

    getArticleTotal = (articleId: number, quantity: number): Promise<number> => {
        return new Promise((resolve, reject) => {
            const article = this.articles.find((article) => article.id === articleId);

            if (!article) reject("The article isn't present in the articles list");
            else resolve(article.price * quantity);
        });
    };

    sumCartPrices = async (cart: CartType): Promise<number> => {
        return await cart.items.reduce(async (a, b) => {
            const sumA = await a;
            const sumB = await this.getArticleTotal(b.article_id, b.quantity);

            return sumA + sumB;
        }, Promise.resolve(0));
    };

    calculate = async () => {
        const calculatedCart: OutputType = { carts: [] };

        for (const cart of this.carts) {
            calculatedCart.carts.push({
                id: cart.id,
                total: await this.sumCartPrices(cart),
            });
        }

        return calculatedCart;
    };
}
