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
const sumCartPrices = (cart, articles) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cart.items.reduce((a, b) => __awaiter(void 0, void 0, void 0, function* () {
        const sumA = yield a;
        const sumB = yield a;
        return sumA + sumB;
    }), Promise.resolve(0));
});
const getCartTotals = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { articles, carts } = data;
    const calculatedCart = { carts: [] };
    for (const cart of carts) {
        calculatedCart.carts.push({
            id: cart.id,
            total: 0,
        });
    }
});
exports.getCartTotals = getCartTotals;