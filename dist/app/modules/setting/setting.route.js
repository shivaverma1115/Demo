"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setting_controller_1 = require("./setting.controller");
const adminVerify_1 = __importDefault(require("../../../middleware/adminVerify"));
const SettingsRouter = express_1.default.Router();
SettingsRouter.post("/create-category", adminVerify_1.default, setting_controller_1.createCategory);
SettingsRouter.post("/create-subcategory", adminVerify_1.default, setting_controller_1.createSubCategory);
SettingsRouter.get("/category", setting_controller_1.getCategory);
SettingsRouter.get("/single-category/:id", setting_controller_1.getSingleCategory);
SettingsRouter.get("/sub-categroy", setting_controller_1.getSubCategory);
SettingsRouter.get("/search-sub-categroy", setting_controller_1.getSearchBrand);
SettingsRouter.get("/search-categroy", setting_controller_1.getSearchCategory);
SettingsRouter.get("/sub-category/:id", setting_controller_1.gateDynamicSubCategory);
SettingsRouter.get("/sub-category-id/:id", setting_controller_1.gateDynamicSubCategoryId);
SettingsRouter.put("/category-image", adminVerify_1.default, setting_controller_1.updateCategoryImage);
SettingsRouter.put("/brand-image", adminVerify_1.default, setting_controller_1.updateBrandImage);
SettingsRouter.put("/update-category-info", adminVerify_1.default, setting_controller_1.updateCategoryInfo);
SettingsRouter.put("/update-subcategory-info", adminVerify_1.default, setting_controller_1.updatesubCategoryInfo);
SettingsRouter.delete("/delete-category", adminVerify_1.default, setting_controller_1.deleteCategory);
SettingsRouter.delete("/delete-subcategory", adminVerify_1.default, setting_controller_1.deletesubCategory);
// all Routes
exports.default = SettingsRouter;
