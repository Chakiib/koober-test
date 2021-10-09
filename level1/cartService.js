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
class Cart {
    constructor(data) {
        this.getArticleTotal = (articleId, quantity) => {
            return new Promise((resolve, reject) => {
                const article = this.articles.find((article) => article.id === articleId);
                if (!article)
                    reject("The article isn't present in the articles list");
                else
                    resolve(article.price * quantity);
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
                calculatedCart.carts.push({
                    id: cart.id,
                    total: yield this.sumCartPrices(cart),
                });
            }
            return calculatedCart;
        });
        this.articles = data.articles;
        this.carts = data.carts;
    }
}
exports.Cart = Cart;
