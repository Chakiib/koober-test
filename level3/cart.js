"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const types_1 = require("./types");
class Cart {
    constructor(data) {
        this.getArticleDiscount = (articleId) => {
            return new Promise((resolve, _reject) => {
                const articleDiscount = this.discounts.find((discount) => discount.article_id === articleId);
                resolve(articleDiscount);
            });
        };
        /**
         * Calculate an article total price
         * The promise will be rejected in case we pass an articleId that isn't present in the articles list
         */
        this.getArticleTotal = (articleId, quantity) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const article = this.articles.find((article) => article.id === articleId);
                if (!article) {
                    reject("The article isn't present in the articles list");
                }
                else {
                    const discount = yield this.getArticleDiscount(article.id);
                    let articlePrice = article.price;
                    if (discount) {
                        if (discount.type === types_1.DiscountTypeType.amount)
                            articlePrice -= discount.value;
                        // We will take the nearest integer in Upward direction in case the reduction is a decimal value
                        else
                            articlePrice = articlePrice - Math.ceil((articlePrice * discount.value) / 100);
                    }
                    resolve(articlePrice * quantity);
                }
            }));
        };
        this.getDeliveryFees = (price) => {
            return new Promise((resolve, _reject) => {
                const transactionVolume = this.delivery_fees.find((fee) => {
                    const { min_price, max_price } = fee.eligible_transaction_volume;
                    /**
                     * Case when eligible_transaction_volume has a min AND max price : price >= min_price AND max_price > price
                     * Case when eligible_transaction_volume has a min_price ONLY: min_price >= price
                     */
                    return (min_price <= price && max_price && max_price > price) || min_price >= price;
                });
                resolve(transactionVolume === null || transactionVolume === void 0 ? void 0 : transactionVolume.price);
            });
        };
        this.sumCartPrices = (cart) => __awaiter(this, void 0, void 0, function* () {
            return yield cart.items.reduce((a, b) => __awaiter(this, void 0, void 0, function* () {
                const sumA = yield a;
                const sumB = yield this.getArticleTotal(b.article_id, b.quantity);
                return sumA + sumB;
            }), Promise.resolve(0));
        });
        this.calculate = () => __awaiter(this, void 0, void 0, function* () {
            const calculatedCart = { carts: [] };
            for (const cart of this.carts) {
                const totalPrice = yield this.sumCartPrices(cart);
                const deliveryFees = yield this.getDeliveryFees(totalPrice);
                calculatedCart.carts.push({
                    id: cart.id,
                    total: totalPrice + deliveryFees,
                });
            }
            return calculatedCart;
        });
        this.articles = data.articles;
        this.carts = data.carts;
        this.delivery_fees = data.delivery_fees;
        this.discounts = data.discounts;
    }
}
exports.Cart = Cart;
