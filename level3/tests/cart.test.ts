import { Cart } from '../cart';
import {
    ArticleType,
    CalculatedCartType,
    CartItemType,
    CartType,
    DeliveryFeeType,
    DiscountType,
    DiscountTypeType,
} from '../types';

describe('cart', () => {
    describe('First data input', () => {
        const cart1Items: CartItemType[] = [
            { article_id: 1, quantity: 6 },
            { article_id: 2, quantity: 2 },
            { article_id: 4, quantity: 1 },
        ];

        const cart2Items: CartItemType[] = [
            { article_id: 2, quantity: 1 },
            { article_id: 3, quantity: 3 },
        ];

        const cart3Items: CartItemType[] = [
            { article_id: 5, quantity: 1 },
            { article_id: 6, quantity: 1 },
        ];

        const cart4Items: CartItemType[] = [{ article_id: 7, quantity: 1 }];

        const cart5Items: CartItemType[] = [{ article_id: 8, quantity: 4 }];

        const carts: CartType[] = [
            { id: 1, items: cart1Items },
            { id: 2, items: cart2Items },
            { id: 3, items: cart3Items },
            { id: 4, items: cart4Items },
            { id: 5, items: cart5Items },
        ];

        const cartWithNonExisitingArticle: CartType = { id: 1, items: [{ article_id: 11, quantity: 6 }] };

        const delivery_fees: DeliveryFeeType[] = [
            {
                eligible_transaction_volume: {
                    min_price: 0,
                    max_price: 1000,
                },
                price: 800,
            },
            {
                eligible_transaction_volume: {
                    min_price: 1000,
                    max_price: 2000,
                },
                price: 400,
            },
            {
                eligible_transaction_volume: {
                    min_price: 2000,
                    max_price: null,
                },
                price: 0,
            },
        ];

        const discounts: DiscountType[] = [
            {
                article_id: 2,
                type: DiscountTypeType.amount,
                value: 25,
            },
            {
                article_id: 5,
                type: DiscountTypeType.percentage,
                value: 30,
            },
            {
                article_id: 6,
                type: DiscountTypeType.percentage,
                value: 30,
            },
            {
                article_id: 7,
                type: DiscountTypeType.percentage,
                value: 25,
            },
            {
                article_id: 8,
                type: DiscountTypeType.percentage,
                value: 10,
            },
        ];

        const articles: ArticleType[] = [
            { id: 1, name: 'water', price: 100 },
            { id: 2, name: 'honey', price: 200 },
            { id: 3, name: 'mango', price: 400 },
            { id: 4, name: 'tea', price: 1000 },
            { id: 5, name: 'ketchup', price: 999 },
            { id: 6, name: 'mayonnaise', price: 999 },
            { id: 7, name: 'fries', price: 378 },
            { id: 8, name: 'ham', price: 147 },
        ];

        const cartTotals: CalculatedCartType[] = [
            { id: 1, total: 2350 },
            { id: 2, total: 1775 },
            { id: 3, total: 1798 },
            { id: 4, total: 1083 },
            { id: 5, total: 1328 },
        ];

        const cart = new Cart({ carts, articles, delivery_fees, discounts });

        describe('getArticleTotal', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);
                try {
                    await cart.getArticleTotal(11, 5);
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the article total is returned', async () => {
                expect.assertions(5);

                const result1 = await cart.getArticleTotal(1, 6);
                const result2 = await cart.getArticleTotal(2, 2);
                const result3 = await cart.getArticleTotal(3, 3);
                const result4 = await cart.getArticleTotal(4, 4);
                const result5 = await cart.getArticleTotal(5, 5);

                expect(result1).toEqual(600);
                expect(result2).toEqual(350);
                expect(result3).toEqual(1200);
                expect(result4).toEqual(4000);
                expect(result5).toEqual(3495);
            });
        });

        describe('sumCartPrices', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    await cart.sumCartPrices(cartWithNonExisitingArticle);
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the sum of the cart prices is returned', async () => {
                expect.assertions(5);

                const result1 = await cart.sumCartPrices(carts[0]);
                const result2 = await cart.sumCartPrices(carts[1]);
                const result3 = await cart.sumCartPrices(carts[2]);
                const result4 = await cart.sumCartPrices(carts[3]);
                const result5 = await cart.sumCartPrices(carts[4]);

                expect(result1).toEqual(1950);
                expect(result2).toEqual(1375);
                expect(result3).toEqual(1398);
                expect(result4).toEqual(283);
                expect(result5).toEqual(528);
            });
        });

        describe('getDeliveryFees', () => {
            test('the promise is resolved and the delivery fees are returned', async () => {
                expect.assertions(3);

                const result1 = await cart.getDeliveryFees(2000);
                const result2 = await cart.getDeliveryFees(1400);
                const result3 = await cart.getDeliveryFees(0);

                expect(result1).toEqual(0);
                expect(result2).toEqual(400);
                expect(result3).toEqual(800);
            });
        });

        describe('getCartTotals', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    const errorCart = new Cart({
                        articles,
                        carts: [...carts, cartWithNonExisitingArticle],
                        delivery_fees,
                        discounts,
                    });

                    await errorCart.calculate();
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the cart totals are returned', async () => {
                expect.assertions(1);

                const result = await cart.calculate();

                expect(result).toEqual({ carts: cartTotals });
            });
        });
    });
});
