import express from "express";
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deletesubCategory,
  gateDynamicSubCategory,
  gateDynamicSubCategoryId,
  getCategory,
  getSearchBrand,
  getSearchCategory,
  getSingleCategory,
  getSubCategory,
  updateBrandImage,
  updateCategoryImage,
  updateCategoryInfo,
  updatesubCategoryInfo,
} from "./setting.controller";
import adminVerify from "../../../middleware/adminVerify";
const SettingsRouter = express.Router();
SettingsRouter.post("/create-category", adminVerify, createCategory);
SettingsRouter.post("/create-subcategory",adminVerify, createSubCategory);

SettingsRouter.get("/category", getCategory);
SettingsRouter.get("/single-category/:id", getSingleCategory);
SettingsRouter.get("/sub-categroy", getSubCategory);
SettingsRouter.get("/search-sub-categroy", getSearchBrand);
SettingsRouter.get("/search-categroy", getSearchCategory);
SettingsRouter.get("/sub-category/:id", gateDynamicSubCategory);
SettingsRouter.get("/sub-category-id/:id", gateDynamicSubCategoryId);

SettingsRouter.put("/category-image", adminVerify, updateCategoryImage); 
SettingsRouter.put("/brand-image", adminVerify, updateBrandImage); 
SettingsRouter.put("/update-category-info", adminVerify, updateCategoryInfo);
SettingsRouter.put("/update-subcategory-info", adminVerify, updatesubCategoryInfo);
SettingsRouter.delete("/delete-category", adminVerify, deleteCategory);
SettingsRouter.delete("/delete-subcategory", adminVerify, deletesubCategory);

// all Routes

export default SettingsRouter;
