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
exports.getSearchRefund = exports.getRefundInfo = exports.getContactInfo = exports.getSingleRefundInfo = exports.createRefundRequest = exports.createConatact = exports.updateReview = exports.deleteReview = exports.getUserReview = exports.getSingleReview = exports.getAllReview = exports.getReview = exports.createReview = void 0;
const product_model_1 = require("./../product/product.model");
const user_input_model_1 = require("./user-input.model");
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewInfo = new user_input_model_1.Reviews(req.body);
        yield reviewInfo.save();
        const sendProdutReview = yield product_model_1.Product.updateOne({ _id: reviewInfo.productId }, { $push: { rettings: reviewInfo.retting } });
        res.send({ message: "success", data: sendProdutReview });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.createReview = createReview;
const getReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.query.id;
        const reviews = yield user_input_model_1.Reviews.find({ productId: productId }).sort({
            date: -1,
        });
        res.send(reviews);
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getReview = getReview;
const getAllReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield user_input_model_1.Reviews.find({}).sort({
            date: -1,
        });
        res.send(reviews);
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getAllReview = getAllReview;
const getSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield user_input_model_1.Reviews.find({ _id: req.params.id });
        if (!review) {
            return res.send({ message: "custom error" });
        }
        res.status(200).send({
            data: review,
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getSingleReview = getSingleReview;
const getUserReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const reviews = yield user_input_model_1.Reviews.find({ email: email }).sort({ date: -1 });
        res.send(reviews);
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getUserReview = getUserReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewInfo = req.body;
        const { _id, retting, productId } = reviewInfo;
        const result = yield user_input_model_1.Reviews.deleteOne({ _id: _id });
        if (result.deletedCount === 1) {
            yield product_model_1.Product.updateOne({ _id: productId }, {
                $pull: {
                    rettings: retting,
                },
            });
            res.send({ message: "success" });
        }
        else {
            res.send({ message: "something is wrong" });
        }
    }
    catch (err) {
        res.status(500).send({ message: "Error occurred while deleting user history" });
    }
});
exports.deleteReview = deleteReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewInfo = req.body;
        const { id, retting, productId, review, oldRatting } = reviewInfo;
        // Update the review in the Reviews collection
        const result = yield user_input_model_1.Reviews.updateOne({ _id: id }, { $set: { retting, review } });
        if (result.matchedCount === 1) {
            // Update the specific element in the rettings array in the Product collection
            yield product_model_1.Product.updateOne({ _id: productId }, {
                $set: {
                    "rettings.$[element]": retting
                }
            }, {
                arrayFilters: [
                    { "element": oldRatting }
                ]
            });
            res.send({ message: "success" });
        }
        else {
            res.send({ message: "something is wrong" });
        }
    }
    catch (err) {
        res.status(500).send({ message: "Error occurred while updating the review" });
    }
});
exports.updateReview = updateReview;
// user contact 
const createConatact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactdata = new user_input_model_1.ContactInfo(req.body);
        if (!contactdata) {
            res.send({ message: "custom error" });
        }
        else {
            yield contactdata.save();
            res.send({ message: "success" });
        }
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.createConatact = createConatact;
const createRefundRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactdata = new user_input_model_1.RefundInfo(req.body);
        if (!contactdata) {
            res.send({ message: "custom error" });
        }
        else {
            yield contactdata.save();
            res.send({ message: "success" });
        }
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.createRefundRequest = createRefundRequest;
const getSingleRefundInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield user_input_model_1.RefundInfo.find({ _id: req.params.id });
        if (!info) {
            return res.send({ message: "custom error" });
        }
        res.status(200).send({
            data: info,
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getSingleRefundInfo = getSingleRefundInfo;
const getContactInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactdata = yield user_input_model_1.ContactInfo.find({});
        const revestData = contactdata.reverse();
        res.send(revestData);
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getContactInfo = getContactInfo;
const getRefundInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const products = yield user_input_model_1.RefundInfo.find({})
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totalProductsCount = yield user_input_model_1.RefundInfo.countDocuments();
        const totalPages = Math.ceil(totalProductsCount / parsedLimit);
        res.status(200).send({
            products,
            totalPages,
            currentPage: parsedPage,
            totalProducts: totalProductsCount,
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getRefundInfo = getRefundInfo;
const getSearchRefund = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
                { phone: { $regex: keyword, $options: "i" } },
                { productId: { $regex: keyword, $options: "i" } },
                { date: { $regex: keyword, $options: "i" } },
                { paymentId: { $regex: keyword, $options: "i" } },
                { productName: { $regex: keyword, $options: "i" } },
            ],
        }));
        const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
        const result = yield user_input_model_1.RefundInfo.find(query);
        res.send(result);
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.getSearchRefund = getSearchRefund;
