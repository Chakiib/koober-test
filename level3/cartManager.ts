import { JsonData, OutputType, CartType, ArticleType, DeliveryFeeType, DiscountType, DiscountTypeType } from './types';

export const getArticleDiscount = (articleId: number, discounts: DiscountType[]): Promise<DiscountType | undefined> => {
    return new Promise((resolve, _reject) => {
        const articleDiscount = discounts.find((discount) => discount.article_id === articleId);

        resolve(articleDiscount);
    });
};

/**
 * Calculate an article total price
 * The promise will be rejected in case we pass an articleId that isn't present in the articles list
 */
export const getArticleTotal = (
    articleId: number,
    quantity: number,
    articles: ArticleType[],
    discounts: DiscountType[]
): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        const article = articles.find((article) => article.id === articleId);

        if (!article) {
            reject("The article isn't present in the articles list");
        } else {
            const discount = await getArticleDiscount(article.id, discounts);
            let articlePrice = article.price;

            if (discount) {
                if (discount.type === DiscountTypeType.amount) articlePrice -= discount.value;
                // We will take the nearest integer in Upward direction in case the reduction is a decimal value
                else articlePrice = articlePrice - Math.ceil((articlePrice * discount.value) / 100);
            }

            resolve(articlePrice * quantity);
        }
    });
};

export const getDeliveryFees = (price: number, deliveryFees: DeliveryFeeType[]): Promise<number> => {
    return new Promise((resolve, _reject) => {
        const transactionVolume = [...deliveryFees].find((fee) => {
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

export const sumCartPrices = async (
    cart: CartType,
    articles: ArticleType[],
    discounts: DiscountType[]
): Promise<number> => {
    return await cart.items.reduce(async (a, b) => {
        const sumA = await a;
        const sumB = await getArticleTotal(b.article_id, b.quantity, articles, discounts);

        return sumA + sumB;
    }, Promise.resolve(0));
};

export const getCartTotals = async (data: JsonData): Promise<OutputType> => {
    const { articles, carts, delivery_fees, discounts } = data;
    const calculatedCart: OutputType = { carts: [] };

    for (const cart of carts) {
        const totalPrice = await sumCartPrices(cart, articles, discounts);
        const deliveryFees = await getDeliveryFees(totalPrice, delivery_fees);

        calculatedCart.carts.push({
            id: cart.id,
            total: totalPrice + deliveryFees,
        });
    }

    return calculatedCart;
};
