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
exports.getCartTotals = exports.sumCartPrices = exports.getDeliveryFees = exports.getArticleTotal = exports.getArticleDiscount = void 0;
const types_1 = require("./types");
const getArticleDiscount = (articleId, discounts) => {
    return new Promise((resolve, _reject) => {
        const articleDiscount = discounts.find((discount) => discount.article_id === articleId);
        resolve(articleDiscount);
    });
};
exports.getArticleDiscount = getArticleDiscount;
/**
 * Calculate an article total price
 * The promise will be rejected in case we pass an articleId that isn't present in the articles list
 */
const getArticleTotal = (articleId, quantity, articles, discounts) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const article = articles.find((article) => article.id === articleId);
        if (!article) {
            reject("The article isn't present in the articles list");
        }
        else {
            const discount = yield (0, exports.getArticleDiscount)(article.id, discounts);
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
exports.getArticleTotal = getArticleTotal;
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
exports.getDeliveryFees = getDeliveryFees;
const sumCartPrices = (cart, articles, discounts) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cart.items.reduce((a, b) => __awaiter(void 0, void 0, void 0, function* () {
        const sumA = yield a;
        const sumB = yield (0, exports.getArticleTotal)(b.article_id, b.quantity, articles, discounts);
        return sumA + sumB;
    }), Promise.resolve(0));
});
exports.sumCartPrices = sumCartPrices;
const getCartTotals = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { articles, carts, delivery_fees, discounts } = data;
    const calculatedCart = { carts: [] };
    for (const cart of carts) {
        const totalPrice = yield (0, exports.sumCartPrices)(cart, articles, discounts);
        const deliveryFees = yield (0, exports.getDeliveryFees)(totalPrice, delivery_fees);
        calculatedCart.carts.push({
            id: cart.id,
            total: totalPrice + deliveryFees,
        });
    }
    return calculatedCart;
});
exports.getCartTotals = getCartTotals;
