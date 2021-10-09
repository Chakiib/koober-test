import * as cartManager from '../cartManager';
import { ArticleType, CalculatedCartType, CartItemType, CartType, DeliveryFeeType } from './../types';

describe('cartManager', () => {
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

        const carts: CartType[] = [
            { id: 1, items: cart1Items },
            { id: 2, items: cart2Items },
            { id: 3, items: [] },
        ];

        const cartWithNonExisitingArticle: CartType = { id: 1, items: [{ article_id: 8, quantity: 6 }] };

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

        const articles: ArticleType[] = [
            { id: 1, name: 'water', price: 100 },
            { id: 2, name: 'honey', price: 200 },
            { id: 3, name: 'mango', price: 400 },
            { id: 4, name: 'tea', price: 1000 },
        ];

        const cartTotals: CalculatedCartType[] = [
            { id: 1, total: 2000 },
            { id: 2, total: 1800 },
            { id: 3, total: 800 },
        ];

        describe('getArticleTotal', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);
                try {
                    await cartManager.getArticleTotal(7, 5, articles);
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the article total is returned', async () => {
                expect.assertions(3);

                const result1 = await cartManager.getArticleTotal(1, 6, articles);
                const result2 = await cartManager.getArticleTotal(2, 2, articles);
                const result3 = await cartManager.getArticleTotal(3, 3, articles);

                expect(result1).toEqual(600);
                expect(result2).toEqual(400);
                expect(result3).toEqual(1200);
            });
        });

        describe('sumCartPrices', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    await cartManager.sumCartPrices(cartWithNonExisitingArticle, articles);
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the sum of the cart prices is returned', async () => {
                expect.assertions(3);

                const result1 = await cartManager.sumCartPrices(carts[0], articles);
                const result2 = await cartManager.sumCartPrices(carts[1], articles);
                const result3 = await cartManager.sumCartPrices(carts[2], articles);

                expect(result1).toEqual(2000);
                expect(result2).toEqual(1400);
                expect(result3).toEqual(0);
            });
        });

        describe('getDeliveryFees', () => {
            test('the promise is resolved and the delivery fees are returned', async () => {
                expect.assertions(3);

                const result1 = await cartManager.getDeliveryFees(2000, delivery_fees);
                const result2 = await cartManager.getDeliveryFees(1400, delivery_fees);
                const result3 = await cartManager.getDeliveryFees(0, delivery_fees);

                expect(result1).toEqual(0);
                expect(result2).toEqual(400);
                expect(result3).toEqual(800);
            });
        });

        describe('getCartTotals', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    await await cartManager.getCartTotals({
                        articles,
                        carts: [...carts, cartWithNonExisitingArticle],
                        delivery_fees,
                    });
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the cart totals are returned', async () => {
                expect.assertions(1);

                const result = await cartManager.getCartTotals({ articles, carts, delivery_fees });

                expect(result).toEqual({ carts: cartTotals });
            });
        });
    });

    describe('Second data input', () => {
        const carts: CartType[] = [
            { id: 1, items: [] },
            { id: 2, items: [] },
        ];

        const cartWithNonExisitingArticle: CartType = { id: 1, items: [{ article_id: 8, quantity: 6 }] };

        const delivery_fees: DeliveryFeeType[] = [
            {
                eligible_transaction_volume: {
                    min_price: 0,
                    max_price: 1500,
                },
                price: 1000,
            },
            {
                eligible_transaction_volume: {
                    min_price: 1500,
                    max_price: 3000,
                },
                price: 200,
            },
            {
                eligible_transaction_volume: {
                    min_price: 3000,
                    max_price: null,
                },
                price: 0,
            },
        ];

        const articles: ArticleType[] = [
            { id: 1, name: 'article1', price: 50 },
            { id: 2, name: 'article2', price: 100 },
            { id: 3, name: 'article3', price: 150 },
        ];

        const cartTotals: any = [
            { id: 1, total: 1000 },
            { id: 2, total: 1000 },
        ];

        describe('getArticleTotal', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    await cartManager.getArticleTotal(7, 5, articles);
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the article total is returned', async () => {
                expect.assertions(3);

                const result1 = await cartManager.getArticleTotal(1, 6, articles);
                const result2 = await cartManager.getArticleTotal(2, 2, articles);
                const result3 = await cartManager.getArticleTotal(3, 3, articles);

                expect(result1).toEqual(300);
                expect(result2).toEqual(200);
                expect(result3).toEqual(450);
            });
        });

        describe('sumCartPrices', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    await cartManager.sumCartPrices(cartWithNonExisitingArticle, articles);
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the sum of the cart prices is returned', async () => {
                expect.assertions(2);

                const result1 = await cartManager.sumCartPrices(carts[0], articles);
                const result2 = await cartManager.sumCartPrices(carts[1], articles);

                expect(result1).toEqual(0);
                expect(result2).toEqual(0);
            });
        });

        describe('getDeliveryFees', () => {
            test('the promise is resolved and the delivery fees are returned', async () => {
                expect.assertions(3);

                const result1 = await cartManager.getDeliveryFees(3000, delivery_fees);
                const result2 = await cartManager.getDeliveryFees(1600, delivery_fees);
                const result3 = await cartManager.getDeliveryFees(0, delivery_fees);

                expect(result1).toEqual(0);
                expect(result2).toEqual(200);
                expect(result3).toEqual(1000);
            });
        });

        describe('getCartTotals', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    await await cartManager.getCartTotals({
                        articles,
                        carts: [...carts, cartWithNonExisitingArticle],
                        delivery_fees,
                    });
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the cart totals are returned', async () => {
                expect.assertions(1);

                const result = await cartManager.getCartTotals({ articles, carts, delivery_fees });

                expect(result).toEqual({ carts: cartTotals });
            });
        });
    });
});
