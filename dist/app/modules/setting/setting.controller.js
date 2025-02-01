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
exports.getSearchCategory = exports.getSearchBrand = exports.updatesubCategoryInfo = exports.gateDynamicSubCategoryId = exports.updateCategoryInfo = exports.updateBrandImage = exports.updateCategoryImage = exports.getSingleCategory = exports.deletesubCategory = exports.deleteCategory = exports.gateDynamicSubCategory = exports.getSubCategory = exports.getCategory = exports.createSubCategory = exports.createCategory = void 0;
const setting_model_1 = require("./setting.model");
// create category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryinfo = req.body;
        const { categoryName, categoryclass, categoryThumb } = categoryinfo;
        const lowercaseCategoryName = categoryName.toLowerCase();
        // Check if the category already exists (case-insensitive)
        const alreadyExist = yield setting_model_1.Category.findOne({
            categoryName: {
                $regex: new RegExp("^" + lowercaseCategoryName + "$", "i"),
            },
        });
        if (alreadyExist) {
            res.send({ message: "Alreay Exist" });
        }
        else {
            const category = new setting_model_1.Category({
                categoryName,
                categoryclass,
                categoryThumb,
            });
            yield category.save();
            res.status(200).send({ message: "success" });
        }
    }
    catch (e) {
        res.send({ message: "custome error" });
    }
});
exports.createCategory = createCategory;
const createSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryinfo = req.body;
        const { subCategoryName, subcategoryclass, categoryName, brandImg } = categoryinfo;
        const lowercaseSubCategoryName = subCategoryName.toLowerCase();
        const alreadyExist = yield setting_model_1.SubCategory.findOne({
            subCategoryName: {
                $regex: new RegExp("^" + lowercaseSubCategoryName + "$", "i"),
            },
        });
        if (alreadyExist) {
            res.send({ message: "Alreay Exist" });
        }
        else {
            const subcategory = new setting_model_1.SubCategory({
                subCategoryName,
                subcategoryclass,
                categoryName,
                brandImg,
            });
            yield subcategory.save();
            res.status(200).send({ message: "success" });
        }
    }
    catch (e) {
        res.send({ message: "custome error" });
    }
});
exports.createSubCategory = createSubCategory;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = (yield setting_model_1.Category.find({})).reverse();
        res.send(categories);
    }
    catch (e) {
        res.send({ message: "custome error" });
    }
});
exports.getCategory = getCategory;
const getSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subCategories = (yield setting_model_1.SubCategory.find({})).reverse();
        res.send(subCategories);
    }
    catch (e) {
        res.send({ message: "custome error" });
    }
});
exports.getSubCategory = getSubCategory;
const gateDynamicSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield setting_model_1.SubCategory.find({ categoryName: req.params.id });
        res.send(categories);
    }
    catch (e) {
        res.send({ message: "custome error" });
    }
});
exports.gateDynamicSubCategory = gateDynamicSubCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield setting_model_1.Category.deleteOne({ _id: req.query.id });
        if (result.deletedCount === 1) {
            res.send({ message: "success" });
        }
        else {
            res.send({ message: "something is wrong" });
        }
    }
    catch (err) {
        res.send({ message: "Error occurred while deleting user history" });
    }
});
exports.deleteCategory = deleteCategory;
const deletesubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield setting_model_1.SubCategory.deleteOne({ _id: req.query.id });
        if (result.deletedCount === 1) {
            res.send({ message: "success" });
        }
        else {
            res.send({ message: "something is wrong" });
        }
    }
    catch (err) {
        res.send({ message: "Error occurred while deleting user history" });
    }
});
exports.deletesubCategory = deletesubCategory;
// get single category
const getSingleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield setting_model_1.Category.find({ _id: req.params.id });
        if (!product) {
            return res.send({ message: "custom error" });
        }
        res.status(200).send({
            data: product,
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getSingleCategory = getSingleCategory;
// update category image
const updateCategoryImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, categoryThumb } = req.body;
        yield setting_model_1.Category.updateOne({ _id: id }, {
            $set: {
                categoryThumb: categoryThumb,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateCategoryImage = updateCategoryImage;
const updateBrandImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, brandImg } = req.body;
        yield setting_model_1.SubCategory.updateOne({ _id: id }, {
            $set: {
                brandImg: brandImg,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateBrandImage = updateBrandImage;
// update basic info
const updateCategoryInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, categoryName, categoryclass } = req.body;
        yield setting_model_1.Category.updateOne({ _id: id }, {
            $set: {
                categoryName,
                categoryclass,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateCategoryInfo = updateCategoryInfo;
const gateDynamicSubCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield setting_model_1.SubCategory.find({ _id: req.params.id });
        res.send(categories);
    }
    catch (e) {
        res.send({ message: "custome error" });
    }
});
exports.gateDynamicSubCategoryId = gateDynamicSubCategoryId;
const updatesubCategoryInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, subCategoryName, categoryName, subcategoryclass } = req.body;
        yield setting_model_1.SubCategory.updateOne({ _id: id }, {
            $set: {
                subCategoryName,
                categoryName,
                subcategoryclass,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updatesubCategoryInfo = updatesubCategoryInfo;
// search brand and category
const getSearchBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                { subCategoryName: { $regex: keyword, $options: "i" } },
                { categoryName: { $regex: keyword, $options: "i" } },
            ],
        }));
        const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
        const result = yield setting_model_1.SubCategory.find(query);
        res.send(result);
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.getSearchBrand = getSearchBrand;
const getSearchCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            $or: [{ categoryName: { $regex: keyword, $options: "i" } }],
        }));
        const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
        const result = yield setting_model_1.Category.find(query);
        res.send(result);
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.getSearchCategory = getSearchCategory;
