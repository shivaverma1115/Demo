import { model, Schema } from "mongoose";
import { CategoryType, SubCategoryType } from "./setting.interface";

const categoryScema = new Schema<CategoryType>({
  categoryName: {
    type: String,
    required: true,
    trim: true,
  },
  categoryclass: {
    type: String,
    required: true,
    trim: true,
  },
  categoryThumb: {
    type: String,
    required: true,
    trim: true,
  },
});

const subcategoryScema = new Schema<SubCategoryType>({
  subCategoryName: {
    type: String,
    required: true,
    trim: true,
  },
  subcategoryclass: {
    type: String,
    required: true,
    trim: true,
  },
  categoryName: {
    type: String,
    required: true,
    trim: true,
  },
  brandImg: {
    type: String,
    trim: true,
  },
});

export const Category = model<CategoryType>("Category", categoryScema);
export const SubCategory = model<SubCategoryType>(
  "SubCategory",
  subcategoryScema
);
