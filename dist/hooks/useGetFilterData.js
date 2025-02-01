"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSells = exports.getSellsItems = exports.getFilterData = void 0;
const moment_1 = __importDefault(require("moment"));
function getFilterData(products, last7Days, currentDate) {
    const last7DaysData = products.filter((item) => {
        const orderDate = (0, moment_1.default)(item.orderDate, "MM/DD/YY h:mm a");
        return orderDate.isBetween(last7Days, currentDate, "day", "[]"); // Include both start and end dates
    });
    return last7DaysData;
}
exports.getFilterData = getFilterData;
function getSellsItems(todayData) {
    const sellsItems = todayData.reduce((sum, product) => {
        return sum + product.totalCard;
    }, 0);
    return sellsItems;
}
exports.getSellsItems = getSellsItems;
function getSells(todayData) {
    const sells = todayData.reduce((sum, product) => {
        return sum + product.price * product.totalCard;
    }, 0);
    return sells; // Added return statement
}
exports.getSells = getSells;
