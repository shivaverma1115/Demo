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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCancelOrdersHistory = exports.getTrackOrder = exports.getSpacificUserCancelData = exports.acceptCancelOrders = exports.searchCancelOrdersPending = exports.searchCancelOrders = exports.getAllCancelOrders = exports.cancelOrders = exports.updateShipmentStatus = exports.clientPaymentInfo = exports.clientOrdersInfo = exports.searchClientProduct = exports.clientOrders = exports.searchClients = exports.getClientInfo = exports.orderInfo = exports.getpurchaseClientInfo = exports.bestSellingProduct = exports.bestCategoryProduct = exports.getClient = exports.sellSummary = exports.SavePaymentInfo = void 0;
const useFormateNumber_1 = require("../../../hooks/useFormateNumber");
const useGetFilterData_1 = require("../../../hooks/useGetFilterData");
const product_model_1 = require("../product/product.model");
const orderSuccess_model_1 = require("./orderSuccess.model");
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const SavePaymentInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentInfo = req.body;
        const orderId = (0, uuid_1.v4)();
        paymentInfo.orderId = orderId;
        const newInfo = new orderSuccess_model_1.Order(paymentInfo);
        yield newInfo.save();
        const products = paymentInfo.orderProducts;
        products.forEach((productId) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield product_model_1.Product.updateMany({ _id: productId === null || productId === void 0 ? void 0 : productId._id }, { $inc: { productQuantity: -(productId === null || productId === void 0 ? void 0 : productId.totalCard) } });
        }));
        res.send({ message: "success", orderId });
    }
    catch (e) {
        res.send({ message: "custome error" });
    }
});
exports.SavePaymentInfo = SavePaymentInfo;
const sellSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderSuccess_model_1.Order.find({});
        const rowproducts = orders.flatMap((order) => order.orderProducts);
        const products = rowproducts.reverse();
        const currentDate = (0, moment_1.default)();
        const last7Days = (0, moment_1.default)().subtract(7, "days");
        const last30Days = (0, moment_1.default)().subtract(30, "days");
        const last1Year = (0, moment_1.default)().subtract(365, "days");
        const todayData = products.filter((item) => {
            const orderDate = (0, moment_1.default)(item.orderDate, "MM/DD/YY h:mm a");
            return orderDate.isSame(currentDate, "day");
        });
        const last7DaysData = (0, useGetFilterData_1.getFilterData)(products, last7Days, currentDate);
        const last30DaysData = (0, useGetFilterData_1.getFilterData)(products, last30Days, currentDate);
        const last1YearData = (0, useGetFilterData_1.getFilterData)(products, last1Year, currentDate);
        // sellsItems
        const todaySellsItem = (0, useGetFilterData_1.getSellsItems)(todayData);
        const todaySells = (0, useGetFilterData_1.getSells)(todayData);
        const last7DaySellsItem = (0, useGetFilterData_1.getSellsItems)(last7DaysData);
        const last7DaySells = (0, useGetFilterData_1.getSells)(last7DaysData);
        const last30DaysSellsItem = (0, useGetFilterData_1.getSellsItems)(last30DaysData);
        const last30DaysSells = (0, useGetFilterData_1.getSells)(last30DaysData);
        const last1YearSellsItem = (0, useGetFilterData_1.getSellsItems)(last1YearData);
        const last1YearSells = (0, useGetFilterData_1.getSells)(last1YearData);
        const totalSellsItem = (0, useGetFilterData_1.getSellsItems)(products);
        const totalSells = (0, useGetFilterData_1.getSells)(products);
        const todaysSells = (0, useFormateNumber_1.formatNumber)(todaySells);
        const lastSevenDaysSells = (0, useFormateNumber_1.formatNumber)(last7DaySells);
        const lastThirtyDaysSells = (0, useFormateNumber_1.formatNumber)(last30DaysSells);
        const lastOneYearSells = (0, useFormateNumber_1.formatNumber)(last1YearSells);
        const lifeTimeSells = (0, useFormateNumber_1.formatNumber)(totalSells);
        const dates = last30DaysData.map((item) => item.orderDate.split(" ")[0]);
        const uniqueDatesSet = new Set(dates);
        const uniqueDatesArray = Array.from(uniqueDatesSet).toString().split(",");
        const formattedDates = uniqueDatesArray.map((dateString) => {
            const [month, day, year] = dateString.split("/");
            const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            const formattedDate = `${parseInt(day, 10)} ${monthNames[parseInt(month, 10) - 1]}`;
            return formattedDate;
        });
        formattedDates.sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA - dateB;
        });
        const dailySalesArray = last30DaysData.reduce((accumulator, item) => {
            const date = item.orderDate.split(" ")[0];
            const sales = item.price * item.totalCard;
            const existingIndex = accumulator.findIndex((entry) => entry.date === date);
            if (existingIndex !== -1) {
                accumulator[existingIndex].totalSales += sales;
            }
            else {
                accumulator.push({ date, totalSales: sales });
            }
            return accumulator;
        }, []);
        dailySalesArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const sellsReport = dailySalesArray.map((entry) => entry.totalSales);
        // daily sold product quantity
        const dailySoldProduct = last30DaysData.reduce((accumulator, item) => {
            const date = item.orderDate.split(" ")[0];
            const totalproduct = item.totalCard;
            const existingIndex = accumulator.findIndex((entry) => entry.date === date);
            if (existingIndex !== -1) {
                accumulator[existingIndex].totalCard += totalproduct;
            }
            else {
                accumulator.push({ date, totalCard: totalproduct });
            }
            return accumulator;
        }, []);
        dailySoldProduct.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const productQuantity = dailySoldProduct.map((item) => item.totalCard);
        const recentProduct = last7DaysData.slice(0, 5);
        const filteredData = {
            // total sells amount
            todaysSells,
            lastSevenDaysSells,
            lastThirtyDaysSells,
            lastOneYearSells,
            lifeTimeSells,
            // sels item number
            todaySellsItem,
            last7DaySellsItem,
            last30DaysSellsItem,
            last1YearSellsItem,
            totalSellsItem,
            last30DaysSells,
            // data
            recentProduct,
            sellsReport,
            productQuantity,
            formattedDates,
        };
        res.send(filteredData);
    }
    catch (e) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.sellSummary = sellSummary;
const getClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderSuccess_model_1.Order.find({}).select("buyerEmail totalPrice name Phone");
        const recentClients = orders.reverse();
        res.send({ message: "success", clients: recentClients });
    }
    catch (e) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.getClient = getClient;
const bestCategoryProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pipeline = [
            {
                $unwind: "$orderProducts",
            },
            {
                $group: {
                    _id: "$orderProducts.categoryName",
                    products: {
                        $push: {
                            productName: "$orderProducts.productName",
                            totalCard: "$orderProducts.totalCard",
                        },
                    },
                },
            },
        ];
        const categoryCounts = yield orderSuccess_model_1.Order.aggregate(pipeline);
        const transformedCategoryProducts = categoryCounts.map((category) => ({
            category: category._id,
            sells: category.products.reduce((totalSells, product) => totalSells + product.totalCard, 0),
        }));
        const categories = transformedCategoryProducts.map((item) => item.category);
        const sells = transformedCategoryProducts.map((item) => item.sells);
        res.send({ message: "success", categories, sells });
    }
    catch (e) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.bestCategoryProduct = bestCategoryProduct;
const bestSellingProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pipeline = [
            { $unwind: "$orderProducts" },
            {
                $group: {
                    _id: "$orderProducts.productName",
                    totalValue: {
                        $sum: {
                            $multiply: ["$orderProducts.totalCard", "$orderProducts.price"],
                        },
                    },
                    totalCardSum: { $sum: "$orderProducts.totalCard" },
                    productIds: { $addToSet: "$orderProducts._id" },
                },
            },
            { $sort: { totalValue: -1 } },
            { $limit: 5 },
        ];
        const bestSoldProducts = yield orderSuccess_model_1.Order.aggregate(pipeline);
        const formattedProducts = bestSoldProducts.map((product) => ({
            productName: product._id,
            totalValue: product.totalValue,
            totalCardSum: product.totalCardSum,
            productId: product.productIds[0],
        }));
        res.send(formattedProducts);
    }
    catch (e) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.bestSellingProduct = bestSellingProduct;
const getpurchaseClientInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderSuccess_model_1.Order.find({ buyerEmail: req.query.email });
        const orderInfo = orders.reverse();
        const clientOrders = orderInfo.flatMap((item) => item.orderProducts);
        // Get unique objects based on _id
        const uniqueClientOrders = Array.from(new Set(clientOrders.map((item) => item._id))).map((id) => clientOrders.find((item) => item._id === id));
        res.send({ message: "success", clients: uniqueClientOrders });
    }
    catch (e) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.getpurchaseClientInfo = getpurchaseClientInfo;
const orderInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const orders = yield orderSuccess_model_1.Order.find({});
        const allProducts = orders.flatMap((order) => order.orderProducts);
        allProducts.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        const startIndex = skip;
        const endIndex = Math.min(skip + parsedLimit, allProducts.length);
        const productIdsForPage = allProducts
            .slice(startIndex, endIndex)
            .map((product) => product._id);
        const products = yield product_model_1.Product.find({ _id: { $in: productIdsForPage } });
        const totalProductsCount = allProducts.length;
        const totalPages = Math.ceil(totalProductsCount / parsedLimit);
        res.status(200).send({
            products,
            totalPages,
            currentPage: parsedPage,
            totalProducts: totalProductsCount,
        });
    }
    catch (e) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.orderInfo = orderInfo;
const getClientInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const products = yield orderSuccess_model_1.Order.find({})
            .select("-orderProducts")
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totalProductsCount = yield orderSuccess_model_1.Order.countDocuments();
        const totalPages = Math.ceil(totalProductsCount / parsedLimit);
        res.status(200).send({
            products,
            totalPages,
            currentPage: parsedPage,
            totalProducts: totalProductsCount,
        });
    }
    catch (e) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.getClientInfo = getClientInfo;
const searchClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.search;
        let keywordArray = [];
        if (searchQuery && typeof searchQuery === "string") {
            keywordArray = searchQuery.split(",");
        }
        else if (Array.isArray(searchQuery)) {
            keywordArray = searchQuery;
        }
        const keywordFilter = keywordArray.map((keyword) => ({
            $or: [
                { buyerEmail: { $regex: keyword, $options: "i" } },
                { name: { $regex: keyword, $options: "i" } },
                { paymentId: { $regex: keyword, $options: "i" } },
                { Phone: { $regex: keyword, $options: "i" } },
                { date: { $regex: keyword, $options: "i" } },
                { shipmentStatus: { $regex: keyword, $options: "i" } },
                { orderId: { $regex: keyword, $options: "i" } },
            ],
        }));
        const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
        const result = yield orderSuccess_model_1.Order.find(query).sort({ date: -1 });
        res.send(result);
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.searchClients = searchClients;
const clientOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Validate id format (example: check if it's a valid ObjectId for MongoDB)
        if (!id) {
            return res.status(400).send({ error: "Invalid ID format" });
        }
        const products = yield orderSuccess_model_1.Order.find({ _id: id }).sort({ date: -1 });
        if (!products || products.length === 0) {
            return res
                .status(404)
                .send({ error: "No products found for the given ID" });
        }
        res.status(200).send({
            products,
        });
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.clientOrders = clientOrders;
const searchClientProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.search; // Convert search query to lowercase
        const id = req.query.id;
        // Find the order based on the provided id
        const result = yield orderSuccess_model_1.Order.findOne({ _id: id });
        if (!result) {
            // If the order is not found, send an appropriate response
            return res.status(404).send({ message: "Order not found" });
        }
        const myArray = result.orderProducts;
        // Search for a product within myArray based on lowercase searchQuery
        const foundProducts = myArray.filter((product) => product.productName.toLowerCase().includes(searchQuery));
        if (foundProducts.length === 0) {
            return res
                .status(404)
                .send({ message: "Product not found in the order" });
        }
        res.send(foundProducts);
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.searchClientProduct = searchClientProduct;
const clientOrdersInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const products = yield orderSuccess_model_1.Order.find({ buyerEmail: email }).sort({ date: -1 });
        // Create a Set to store unique product IDs
        const uniqueProductIds = new Set();
        // Iterate through each order and its products
        products.forEach((order) => {
            order.orderProducts.forEach((product) => {
                // Add the product's "_id" to the Set
                uniqueProductIds.add(product._id);
            });
        });
        // Convert the Set back to an array
        const uniqueProducts = Array.from(uniqueProductIds);
        // Fetch full product details for each unique product ID
        const orderProduct = yield product_model_1.Product.find({ _id: { $in: uniqueProducts } })
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totalProductsCount = yield product_model_1.Product.countDocuments();
        const totalPages = Math.ceil(totalProductsCount / parsedLimit);
        res.status(200).send({
            orderProduct,
            totalPages,
            currentPage: parsedPage,
            totalProducts: totalProductsCount,
        });
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.clientOrdersInfo = clientOrdersInfo;
const clientPaymentInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const products = yield orderSuccess_model_1.Order.find({ buyerEmail: email }).sort({ date: -1 });
        res.status(200).send({ message: "success", data: products });
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.clientPaymentInfo = clientPaymentInfo;
const updateShipmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id, shipmentStatus, orderStatusDate, paymentId, orderId } = req.body;
        const shipmentInfo = {
            shipmentStatus,
            orderStatusDate,
            paymentId,
            orderId,
        };
        const orderData = yield orderSuccess_model_1.Order.findOne({ _id: id });
        const isExist = (_a = orderData === null || orderData === void 0 ? void 0 : orderData.shipmentStatusArray) === null || _a === void 0 ? void 0 : _a.find((item) => item.shipmentStatus == shipmentStatus);
        if (isExist) {
            res.send({
                message: "duplicate error",
                data: `Already ${isExist === null || isExist === void 0 ? void 0 : isExist.shipmentStatus}`,
            });
        }
        else {
            const result = yield orderSuccess_model_1.Order.updateOne({ _id: id }, {
                $set: {
                    shipmentStatus,
                    orderStatusDate,
                },
                $addToSet: { shipmentStatusArray: { $each: [shipmentInfo] } },
            });
            if (result.modifiedCount == 1) {
                res.send({ message: "success", result });
            }
            else {
                res.send({ message: "error" });
            }
        }
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateShipmentStatus = updateShipmentStatus;
// cencel order
const cancelOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const cancelData = req.body;
        const { id, buyerEmail, EmailAddress, orderProduct, date, Phone, paymentId, orderId, } = cancelData;
        const ClientOrder = yield orderSuccess_model_1.Order.findOne({ _id: cancelData === null || cancelData === void 0 ? void 0 : cancelData.id });
        if ((ClientOrder === null || ClientOrder === void 0 ? void 0 : ClientOrder.paymentId) && (ClientOrder === null || ClientOrder === void 0 ? void 0 : ClientOrder.shipmentStatus) === "pending") {
            const cancelOrder = new orderSuccess_model_1.CancelOrder({
                buyerEmail,
                EmailAddress,
                date,
                Phone,
                productId: id,
                productName: orderProduct === null || orderProduct === void 0 ? void 0 : orderProduct.productName,
                returnAmount: (orderProduct === null || orderProduct === void 0 ? void 0 : orderProduct.price) * (orderProduct === null || orderProduct === void 0 ? void 0 : orderProduct.totalCard),
                paymentId,
                orderId,
                returnStatus: "pending",
                orderProduct,
            });
            const saveData = yield cancelOrder.save();
            if (saveData) {
                const result = yield orderSuccess_model_1.Order.updateOne({ _id: ClientOrder === null || ClientOrder === void 0 ? void 0 : ClientOrder.id }, {
                    $pull: { orderProducts: { _id: (_b = cancelData === null || cancelData === void 0 ? void 0 : cancelData.orderProduct) === null || _b === void 0 ? void 0 : _b._id } },
                });
                if (result.modifiedCount === 1) {
                    const isEmpthy = yield orderSuccess_model_1.Order.findOne({ _id: ClientOrder === null || ClientOrder === void 0 ? void 0 : ClientOrder.id });
                    if (((_c = isEmpthy === null || isEmpthy === void 0 ? void 0 : isEmpthy.orderProducts) === null || _c === void 0 ? void 0 : _c.length) === 0) {
                        const result = yield orderSuccess_model_1.Order.updateOne({ _id: ClientOrder === null || ClientOrder === void 0 ? void 0 : ClientOrder.id }, {
                            $set: { shipmentStatus: "order cancelled" },
                        });
                    }
                    res.send({ message: "Order Canceled" });
                }
                else {
                    res.send({ message: "Payment Id Not Match" });
                }
            }
        }
        else {
            res.send({ message: "Payment Id Not Found" });
        }
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.cancelOrders = cancelOrders;
// accept cancel order
const getAllCancelOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const products = yield orderSuccess_model_1.CancelOrder.find({ returnStatus: "pending" })
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totalProductsCount = yield orderSuccess_model_1.CancelOrder.countDocuments();
        const totalPages = Math.ceil(totalProductsCount / parsedLimit);
        res.status(200).send({
            products,
            totalPages,
            currentPage: parsedPage,
            totalProducts: totalProductsCount,
        });
    }
    catch (e) {
        res.status(500).send({ message: "Error fetching products" });
    }
});
exports.getAllCancelOrders = getAllCancelOrders;
const searchCancelOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.search;
        let keywordArray = [];
        if (searchQuery && typeof searchQuery === "string") {
            keywordArray = searchQuery.split(",");
        }
        else if (Array.isArray(searchQuery)) {
            keywordArray = searchQuery;
        }
        const keywordFilter = keywordArray.map((keyword) => ({
            $or: [
                { buyerEmail: { $regex: keyword, $options: "i" } },
                { productName: { $regex: keyword, $options: "i" } },
                { EmailAddress: { $regex: keyword, $options: "i" } },
                { date: { $regex: keyword, $options: "i" } },
                { orderId: { $regex: keyword, $options: "i" } },
            ],
            returnStatus: "approved", //
        }));
        const query = {
            $and: [
                { $or: keywordFilter.length > 0 ? keywordFilter : [{}] },
                { returnStatus: "approved" },
            ],
        };
        const result = yield orderSuccess_model_1.CancelOrder.find(query).sort({ date: -1 });
        res.send({ message: "success", data: result });
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.searchCancelOrders = searchCancelOrders;
// 
const searchCancelOrdersPending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.search;
        let keywordArray = [];
        if (searchQuery && typeof searchQuery === "string") {
            keywordArray = searchQuery.split(",");
        }
        else if (Array.isArray(searchQuery)) {
            keywordArray = searchQuery;
        }
        const keywordFilter = keywordArray.map((keyword) => ({
            $or: [
                { buyerEmail: { $regex: keyword, $options: "i" } },
                { productName: { $regex: keyword, $options: "i" } },
                { EmailAddress: { $regex: keyword, $options: "i" } },
                { date: { $regex: keyword, $options: "i" } },
            ],
            returnStatus: "pending",
        }));
        const query = {
            $and: [
                { $or: keywordFilter.length > 0 ? keywordFilter : [{}] },
                { returnStatus: "pending" },
            ],
        };
        const result = yield orderSuccess_model_1.CancelOrder.find(query).sort({ date: -1 });
        res.send({ message: "success", data: result });
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.searchCancelOrdersPending = searchCancelOrdersPending;
// 
const acceptCancelOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cancelInfo = req.body;
        const { id, productId, returnAmount } = cancelInfo;
        const data = yield orderSuccess_model_1.CancelOrder.findOne({ _id: id });
        if (data === null || data === void 0 ? void 0 : data.paymentId) {
            const result = yield orderSuccess_model_1.CancelOrder.updateOne({ _id: id }, {
                $set: {
                    returnStatus: "approved",
                },
            });
            // delete data
            if (result.modifiedCount == 1) {
                const oldObject = yield orderSuccess_model_1.Order.findOne({ _id: productId });
                yield orderSuccess_model_1.Order.updateOne({ _id: productId }, {
                    $set: {
                        totalPrice: (oldObject === null || oldObject === void 0 ? void 0 : oldObject.totalPrice) - returnAmount,
                    },
                });
                res.send({ message: "success" });
            }
            else {
                res.send({ message: "something is wrong" });
            }
        }
    }
    catch (e) {
        res.send({ message: "something is wrong" });
    }
});
exports.acceptCancelOrders = acceptCancelOrders;
const getSpacificUserCancelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        const result = yield orderSuccess_model_1.CancelOrder.find({ buyerEmail: email });
        if (result.length) {
            res.send({ message: "success", data: result });
        }
        else {
            res.status(404).send({ message: "Data Not Found" });
        }
    }
    catch (e) {
        res.status(500).send({ message: "Error fetching products" });
    }
});
exports.getSpacificUserCancelData = getSpacificUserCancelData;
const getTrackOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const orderId = req.params.id;
        // Validate id format (example: check if it's a valid ObjectId for MongoDB)
        if (!orderId) {
            return res.status(400).send({ error: "Invalid ID format" });
        }
        const products = yield orderSuccess_model_1.Order.findOne({ orderId: orderId });
        if (!products || ((_d = products === null || products === void 0 ? void 0 : products.orderProducts) === null || _d === void 0 ? void 0 : _d.length) === 0) {
            res.send({ message: "No products found for the given ID" });
        }
        else {
            res.send({ message: "success", data: [products] });
        }
    }
    catch (e) {
        res.send({ message: "Internal Server Error" });
    }
});
exports.getTrackOrder = getTrackOrder;
const getAllCancelOrdersHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const products = yield orderSuccess_model_1.CancelOrder.find({
            returnStatus: { $ne: "pending" },
        })
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totalProductsCount = yield orderSuccess_model_1.CancelOrder.countDocuments();
        const totalPages = Math.ceil(totalProductsCount / parsedLimit);
        res.status(200).send({
            products,
            totalPages,
            currentPage: parsedPage,
            totalProducts: totalProductsCount,
        });
    }
    catch (e) {
        res.status(500).send({ message: "Error fetching products" });
    }
});
exports.getAllCancelOrdersHistory = getAllCancelOrdersHistory;
