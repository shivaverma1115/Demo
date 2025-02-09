"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterData = getFilterData;
exports.getSellsItems = getSellsItems;
exports.getSells = getSells;
const moment_1 = __importDefault(require("moment"));
function getFilterData(products, last7Days, currentDate) {
    const last7DaysData = products.filter((item) => {
        const orderDate = (0, moment_1.default)(item.orderDate, "MM/DD/YY h:mm a");
        return orderDate.isBetween(last7Days, currentDate, "day", "[]"); // Include both start and end dates
    });
    return last7DaysData;
}
function getSellsItems(todayData) {
    const sellsItems = todayData.reduce((sum, product) => {
        return sum + product.totalCard;
    }, 0);
    return sellsItems;
}
function getSells(todayData) {
    const sells = todayData.reduce((sum, product) => {
        return sum + product.price * product.totalCard;
    }, 0);
    return sells; // Added return statement
}
