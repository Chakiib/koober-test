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
exports.getCartTotals = void 0;
/**
 * Calculate an article total price
 * The promise will be rejected in case we pass an articleId that isn't present in the articles list
 */
const getArticleTotal = (articleId, quantity, articles) => {
    return new Promise((resolve, reject) => {
        const article = articles.find((article) => article.id === articleId);
        if (!article)
            reject("The article isn't present in the articles list");
        else
            resolve(article.price * quantity);
    });
};
const getDeliveryFees = (price, deliveryFees) => {
    return new Promise((resolve, _reject) => {
        const transactionVolume = [...deliveryFees].find((fee) => {
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
const sumCartPrices = (cart, articles) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cart.items.reduce((a, b) => __awaiter(void 0, void 0, void 0, function* () {
        const sumA = yield a;
        const sumB = yield getArticleTotal(b.article_id, b.quantity, articles);
        return sumA + sumB;
    }), Promise.resolve(0));
});
const getCartTotals = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { articles, carts, delivery_fees } = data;
    const calculatedCart = { carts: [] };
    for (const cart of carts) {
        const totalPrice = yield sumCartPrices(cart, articles);
        const deliveryFees = yield getDeliveryFees(totalPrice, delivery_fees);
        calculatedCart.carts.push({
            id: cart.id,
            total: totalPrice + deliveryFees,
        });
    }
    return calculatedCart;
});
exports.getCartTotals = getCartTotals;
