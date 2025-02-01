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
exports.getSubCategoryWizeProducts = exports.updateOfferBannerImage = exports.getFiltredPorductFromAdmin = exports.searchOfferProducts = exports.deleteOfferProduct = exports.allOfferProduct = exports.getOfferProduct = exports.createOffer = exports.Rattings = exports.Review = exports.newArrival = exports.bestSellingProduct = exports.TrendingProduct = exports.OfferProductBanner = exports.OfferProduct = exports.getFiltredPorduct = exports.deleteProduct = exports.deleteSingleImg = exports.updateMultipleImg = exports.updateProductInfo = exports.updateBannerImage = exports.getSinglePorduct = exports.allProduct = exports.createProduct = void 0;
const product_model_1 = require("./product.model");
const user_input_model_1 = require("../user-input/user-input.model");
const orderSuccess_model_1 = require("../OrderProduct/orderSuccess.model");
const setting_model_1 = require("../setting/setting.model");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productInfo = req.body;
        const { productName, categoryName, subcategoryName } = productInfo;
        const alreayExist = yield product_model_1.Product.findOne({ productName: productName });
        if (alreayExist) {
            res.send({ message: "Already Exist" });
        }
        else {
            if (categoryName === "select any category" ||
                subcategoryName === "select any category") {
                res.send({ message: "category not selected" });
            }
            else {
                const newproduct = new product_model_1.Product(productInfo);
                yield newproduct.save();
                res.status(200).send({ message: "success" });
            }
        }
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.createProduct = createProduct;
const allProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        // Updated query to filter products where productQuantity is greater than or equal to 1
        const products = yield product_model_1.Product.find({})
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totalProductsCount = yield product_model_1.Product.countDocuments();
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
exports.allProduct = allProduct;
const getSinglePorduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.find({ _id: req.params.id });
        const rettings = yield user_input_model_1.Reviews.aggregate([
            { $match: { productId: req.params.id, retting: { $gte: 1 } } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$retting" },
                    totalCount: { $sum: 1 },
                },
            },
        ]);
        const avgRating = rettings.length > 0 ? rettings[0].averageRating : 0;
        const totalRettings = rettings.length > 0 ? rettings[0].totalCount : 0;
        const averageRating = parseFloat(avgRating.toFixed(1));
        const rettingsData = {
            rettings: totalRettings,
            averageRating: averageRating,
        };
        res.status(200).send({
            data: product,
            rettingsData,
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getSinglePorduct = getSinglePorduct;
const updateBannerImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, updateImage } = req.body;
        yield product_model_1.Product.updateOne({ _id: id }, {
            $set: {
                img: updateImage,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateBannerImage = updateBannerImage;
const updateProductInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, productName, price, oldPrice, productQuantity, subcategoryName, categoryName, productDetails, } = req.body;
        yield product_model_1.Product.updateOne({ _id: id }, {
            $set: {
                productName,
                price,
                oldPrice,
                productQuantity,
                subcategoryName,
                categoryName,
                productDetails,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateProductInfo = updateProductInfo;
const updateMultipleImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, updateImages } = req.body;
        yield product_model_1.Product.updateOne({ _id: id }, {
            $addToSet: {
                productImages: {
                    $each: updateImages,
                },
            },
        });
        res.send({ message: "success", data: updateImages });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateMultipleImg = updateMultipleImg;
const deleteSingleImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, deletetImg } = req.body;
        yield product_model_1.Product.updateOne({ _id: id }, { $pull: { productImages: deletetImg } });
        res.send({ message: "success", data: deletetImg });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.deleteSingleImg = deleteSingleImg;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.Product.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 1) {
            const exsistProduct = yield product_model_1.OffProduct.findOne({
                productId: req.params.id,
            });
            if (exsistProduct) {
                const deleteOfferInfo = yield product_model_1.OffProduct.deleteOne({
                    productId: req.params.id,
                });
                if (deleteOfferInfo.deletedCount === 1) {
                    res.send({ message: "success" });
                }
                else {
                    res.send({ message: "something is wrong" });
                }
            }
        }
        else {
            res.send({ message: "success" });
        }
    }
    catch (err) {
        res.send({ message: "Error occurred while deleting user history" });
    }
});
exports.deleteProduct = deleteProduct;
const getFiltredPorduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.search;
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        let keywordArray = [];
        if (searchQuery && typeof searchQuery === "string") {
            keywordArray = searchQuery.split(",");
        }
        else if (Array.isArray(searchQuery)) {
            keywordArray = searchQuery;
        }
        const keywordFilter = keywordArray.map((keyword) => ({
            $or: [
                { categoryName: { $regex: keyword, $options: "i" } },
                { productName: { $regex: keyword, $options: "i" } },
                { subcategoryName: { $regex: keyword, $options: "i" } },
                { offerPercent: { $regex: keyword, $options: "i" } },
                { productStatus: { $regex: keyword, $options: "i" } },
            ],
        }));
        const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
        const products = yield product_model_1.Product.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totalProductsCount = yield product_model_1.Product.countDocuments();
        const totalPages = Math.ceil(totalProductsCount / parsedLimit);
        res.status(200).send({
            products,
            totalPages,
            currentPage: parsedPage,
            totalProducts: totalProductsCount,
        });
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.getFiltredPorduct = getFiltredPorduct;
const OfferProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.find({ offer: true }).sort({ date: -1 });
        res.status(200).send(product);
    }
    catch (e) {
        res.status(500).send({ message: "Error fetching products" });
    }
});
exports.OfferProduct = OfferProduct;
const OfferProductBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.OffProduct.find({}).sort({ date: -1 });
        res.status(200).send(product);
    }
    catch (e) {
        res.status(500).send({ message: "Error fetching products" });
    }
});
exports.OfferProductBanner = OfferProductBanner;
const TrendingProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.Product.find({});
        // Calculate average rating for each product and add it to the product object
        const productsWithAverageRating = products.map((product) => {
            const sum = product.rettings.reduce((acc, currentValue) => acc + currentValue, 0);
            const rettingsLength = product.rettings.length;
            const averageRating = rettingsLength > 0 ? sum / rettingsLength : 0;
            return Object.assign(Object.assign({}, product.toObject()), { averageRating: parseFloat(averageRating.toFixed(1)), numRatings: rettingsLength });
        });
        // Sort products by average rating and then by number of ratings
        const sortedProducts = productsWithAverageRating.sort((a, b) => {
            if (b.averageRating !== a.averageRating) {
                return b.averageRating - a.averageRating; // Sort by average rating in descending order
            }
            else if (b.numRatings !== a.numRatings) {
                return b.numRatings - a.numRatings; // If average ratings are equal, sort by number of ratings in descending order
            }
            else {
                // If both average rating and numRatings are equal, keep the original order
                return 0;
            }
        });
        const top10Products = sortedProducts.slice(0, 10);
        res.status(200).send(top10Products);
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: "Error fetching products" });
    }
});
exports.TrendingProduct = TrendingProduct;
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
            { $limit: 12 },
        ];
        const bestSoldProducts = yield orderSuccess_model_1.Order.aggregate(pipeline);
        const formattedProducts = bestSoldProducts.map((product) => {
            const productId = product.productIds[0];
            return {
                productIds: productId,
                totalValue: product.totalValue,
                totalCardSum: product.totalCardSum,
            };
        });
        const productIds = formattedProducts.map((product) => product.productIds);
        const products = yield product_model_1.Product.find({ _id: { $in: productIds } });
        const orderedProducts = formattedProducts.map((formattedProduct) => products.find((product) => product._id.toString() === formattedProduct.productIds));
        res.status(200).send(orderedProducts);
    }
    catch (e) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.bestSellingProduct = bestSellingProduct;
const newArrival = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.find({}).sort({ date: -1 });
        res.status(200).send(product);
    }
    catch (e) {
        res.status(500).send({ message: "Error fetching products" });
    }
});
exports.newArrival = newArrival;
const Review = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield user_input_model_1.Reviews.find({}).sort({ retting: -1, date: -1 });
        const uniqueEmailReviews = {};
        reviews.forEach((review) => {
            const email = review.email;
            if (!uniqueEmailReviews[email] ||
                review.retting > uniqueEmailReviews[email].retting) {
                uniqueEmailReviews[email] = review;
            }
        });
        const uniqueReviews = Object.values(uniqueEmailReviews);
        res.status(200).send(uniqueReviews);
    }
    catch (e) {
        res.status(500).send({ message: "Error fetching reviews" });
    }
});
exports.Review = Review;
const Rattings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ratting = yield user_input_model_1.Reviews.find({}, { retting: 1 }).sort({
            retting: -1,
            date: -1,
        });
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratting.forEach((review) => {
            if (review.retting in counts) {
                counts[review.retting]++;
            }
        });
        const resultArray = Object.entries(counts).map(([key, value]) => ({
            retting: parseInt(key),
            totalRatting: value,
        }));
        const reversedArray = resultArray.reverse();
        res.status(200).send(reversedArray);
    }
    catch (e) {
        res.status(500).send({ message: "Error fetching reviews" });
    }
});
exports.Rattings = Rattings;
const createOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productInfo = req.body;
        const { productId, offerPersent, banner, price, oldPrice } = productInfo;
        const alreadyExist = yield product_model_1.OffProduct.findOne({ productId });
        if (alreadyExist) {
            yield product_model_1.OffProduct.updateOne({ productId: productId }, { offerPersent, banner, price, oldPrice });
            yield product_model_1.Product.updateOne({ _id: productId }, { offerPersent, offer: true, price, oldPrice });
        }
        else {
            const newProduct = new product_model_1.OffProduct(productInfo);
            yield newProduct.save();
            yield product_model_1.Product.updateOne({ _id: productId }, { offerPersent, offer: true, price, oldPrice });
        }
        res.status(200).json({ message: "success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createOffer = createOffer;
const getOfferProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const offerProduct = yield product_model_1.OffProduct.findOne({ productId: id });
        res.status(200).json({ message: "success", data: offerProduct });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getOfferProduct = getOfferProduct;
const allOfferProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const products = yield product_model_1.OffProduct.find({})
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totalProductsCount = yield product_model_1.OffProduct.countDocuments();
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
exports.allOfferProduct = allOfferProduct;
// delete offer product
const deleteOfferProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const SingleOfferProduct = yield product_model_1.OffProduct.findOne({ _id: req.params.id });
        const result = yield product_model_1.OffProduct.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 1) {
            yield product_model_1.Product.updateOne({ _id: SingleOfferProduct === null || SingleOfferProduct === void 0 ? void 0 : SingleOfferProduct.productId }, {
                offerPersent: 0,
                offer: false,
                price: SingleOfferProduct === null || SingleOfferProduct === void 0 ? void 0 : SingleOfferProduct.oldPrice,
                oldPrice: 0,
            });
            res.status(200).send({ message: "success" });
        }
        else {
        }
    }
    catch (err) {
        res.send({ message: "Error occurred while deleting user history" });
    }
});
exports.deleteOfferProduct = deleteOfferProduct;
// search
const searchOfferProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            $or: [{ productName: { $regex: keyword, $options: "i" } }],
        }));
        const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
        const result = yield product_model_1.OffProduct.find(query);
        res.send(result);
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.searchOfferProducts = searchOfferProducts;
// product search from admin pannel
const getFiltredPorductFromAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                { categoryName: { $regex: keyword, $options: "i" } },
                { productName: { $regex: keyword, $options: "i" } },
                { subcategoryName: { $regex: keyword, $options: "i" } },
                { offerPercent: { $regex: keyword, $options: "i" } },
                { productStatus: { $regex: keyword, $options: "i" } },
            ],
        }));
        const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
        const result = yield product_model_1.Product.find(query);
        res.send(result);
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.getFiltredPorductFromAdmin = getFiltredPorductFromAdmin;
// update offer banner
const updateOfferBannerImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, updateImage } = req.body;
        yield product_model_1.OffProduct.updateOne({ _id: id }, {
            $set: {
                banner: updateImage,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateOfferBannerImage = updateOfferBannerImage;
// get product brand or subcategory wize
const getSubCategoryWizeProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const data = yield setting_model_1.SubCategory.findOne({ _id: id });
        const subCategory = data === null || data === void 0 ? void 0 : data.subCategoryName;
        const products = yield product_model_1.Product.find({ subcategoryName: subCategory })
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totalProductsCount = yield product_model_1.Product.countDocuments();
        const totalPages = Math.ceil(totalProductsCount / parsedLimit);
        if (!products.length) {
            res.status(400).send({ message: "Product Not Available" });
        }
        res.status(200).send({
            products,
            totalPages,
            currentPage: parsedPage,
            totalProducts: totalProductsCount,
        });
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.getSubCategoryWizeProducts = getSubCategoryWizeProducts;
