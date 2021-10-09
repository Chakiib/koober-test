import { JsonData, OutputType, CartType, ArticleType, DeliveryFeeType } from './types';

export class Cart {
    articles: ArticleType[];
    carts: CartType[];
    delivery_fees: DeliveryFeeType[];

    constructor(data: JsonData) {
        this.articles = data.articles;
        this.carts = data.carts;
        this.delivery_fees = data.delivery_fees;
    }

    /**
     * Calculate an article total price
     * The promise will be rejected in case we pass an articleId that isn't present in the articles list
     */
    getArticleTotal = (articleId: number, quantity: number): Promise<number> => {
        return new Promise((resolve, reject) => {
            const article = this.articles.find((article) => article.id === articleId);

            if (!article) reject("The article isn't present in the articles list");
            else resolve(article.price * quantity);
        });
    };

    getDeliveryFees = (price: number): Promise<number> => {
        return new Promise((resolve, _reject) => {
            const transactionVolume = this.delivery_fees.find((fee) => {
                const { min_price, max_price } = fee.eligible_transaction_volume;

                /**
                 * Case when eligible_transaction_volume has a min AND max price : price >= min_price AND max_price > price
                 * Case when eligible_transaction_volume has a min_price ONLY: min_price >= price
                 */
                return (min_price <= price && max_price && max_price > price) || min_price >= price;
            });

            resolve(transactionVolume?.price!);
        });
    };

    sumCartPrices = async (cart: CartType): Promise<number> => {
        return await cart.items.reduce(async (a, b) => {
            const sumA = await a;
            const sumB = await this.getArticleTotal(b.article_id, b.quantity);

            return sumA + sumB;
        }, Promise.resolve(0));
    };

    calculate = async (): Promise<OutputType> => {
        const calculatedCart: OutputType = { carts: [] };

        for (const cart of this.carts) {
            const totalPrice = await this.sumCartPrices(cart);
            const deliveryFees = await this.getDeliveryFees(totalPrice);

            calculatedCart.carts.push({
                id: cart.id,
                total: totalPrice + deliveryFees,
            });
        }

        return calculatedCart;
    };
}
