import { Cart } from '../cart';
import { ArticleType, CalculatedCartType, CartItemType, CartType } from '../types';

describe('CartService', () => {
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

        const articles: ArticleType[] = [
            { id: 1, name: 'water', price: 100 },
            { id: 2, name: 'honey', price: 200 },
            { id: 3, name: 'mango', price: 400 },
            { id: 4, name: 'tea', price: 1000 },
        ];

        const cartTotals: CalculatedCartType[] = [
            { id: 1, total: 2000 },
            { id: 2, total: 1400 },
            { id: 3, total: 0 },
        ];

        const cart = new Cart({ carts, articles });

        describe('getArticleTotal', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    await cart.getArticleTotal(7, 5);
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the article total is returned', async () => {
                expect.assertions(3);

                const result1 = await cart.getArticleTotal(1, 6);
                const result2 = await cart.getArticleTotal(2, 2);
                const result3 = await cart.getArticleTotal(3, 3);

                expect(result1).toEqual(600);
                expect(result2).toEqual(400);
                expect(result3).toEqual(1200);
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
                expect.assertions(3);

                const result1 = await cart.sumCartPrices(carts[0]);
                const result2 = await cart.sumCartPrices(carts[1]);
                const result3 = await cart.sumCartPrices(carts[2]);

                expect(result1).toEqual(2000);
                expect(result2).toEqual(1400);
                expect(result3).toEqual(0);
            });
        });

        describe('calculateCart', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    const errorCart = new Cart({ articles, carts: [...carts, cartWithNonExisitingArticle] });
                    await await errorCart.calculate();
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

    describe('Second data input', () => {
        const carts: CartType[] = [
            { id: 1, items: [] },
            { id: 2, items: [] },
        ];

        const cartWithNonExisitingArticle: CartType = { id: 1, items: [{ article_id: 8, quantity: 6 }] };

        const articles: ArticleType[] = [
            { id: 1, name: 'article1', price: 50 },
            { id: 2, name: 'article2', price: 100 },
            { id: 3, name: 'article3', price: 150 },
        ];

        const cart = new Cart({ carts, articles });

        const cartTotals: any = [
            { id: 1, total: 0 },
            { id: 2, total: 0 },
        ];

        describe('getArticleTotal', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    await cart.getArticleTotal(7, 5);
                } catch (error) {
                    expect(error).toMatch("The article isn't present in the articles list");
                }
            });

            test('the promise is resolved and the article total is returned', async () => {
                expect.assertions(3);

                const result1 = await cart.getArticleTotal(1, 6);
                const result2 = await cart.getArticleTotal(2, 2);
                const result3 = await cart.getArticleTotal(3, 3);

                expect(result1).toEqual(300);
                expect(result2).toEqual(200);
                expect(result3).toEqual(450);
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
                expect.assertions(2);

                const result1 = await cart.sumCartPrices(carts[0]);
                const result2 = await cart.sumCartPrices(carts[1]);

                expect(result1).toEqual(0);
                expect(result2).toEqual(0);
            });
        });

        describe('getCartTotals', () => {
            test("the promise is rejected if an article doesn't exist", async () => {
                expect.assertions(1);

                try {
                    const errorCart = new Cart({ articles, carts: [...carts, cartWithNonExisitingArticle] });
                    await await errorCart.calculate();
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
