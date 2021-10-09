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
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const { read, write } = require('./fileManager');
    try {
        const data = yield read('input.json');
        const inputData = JSON.parse(data);
        const { Cart } = require('./cart');
        const cart = new Cart(inputData);
        const calculatedCarts = yield cart.calculate();
        try {
            yield write('output.json', JSON.stringify(calculatedCarts, null, 2));
        }
        catch (err) {
            console.error(err);
        }
    }
    catch (err) {
        console.error(err);
    }
});
if (require.main === module) {
    main();
}
