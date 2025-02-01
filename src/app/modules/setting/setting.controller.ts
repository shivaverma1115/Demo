import { Request, Response } from "express";
import { Category, SubCategory } from "./setting.model";
// create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryinfo = req.body;
    const { categoryName, categoryclass, categoryThumb } = categoryinfo;
    const lowercaseCategoryName = categoryName.toLowerCase();

    // Check if the category already exists (case-insensitive)
    const alreadyExist = await Category.findOne({
      categoryName: {
        $regex: new RegExp("^" + lowercaseCategoryName + "$", "i"),
      },
    });

    if (alreadyExist) {
      res.send({ message: "Alreay Exist" });
    } else {
      const category = new Category({
        categoryName,
        categoryclass,
        categoryThumb,
      });

      await category.save();
      res.status(200).send({ message: "success" });
    }
  } catch (e) {
    res.send({ message: "custome error" });
  }
};

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const categoryinfo = req.body;
    const { subCategoryName, subcategoryclass, categoryName, brandImg } =
      categoryinfo;
    const lowercaseSubCategoryName = subCategoryName.toLowerCase();
    const alreadyExist = await SubCategory.findOne({
      subCategoryName: {
        $regex: new RegExp("^" + lowercaseSubCategoryName + "$", "i"),
      },
    });

    if (alreadyExist) {
      res.send({ message: "Alreay Exist" });
    } else {
      const subcategory = new SubCategory({
        subCategoryName,
        subcategoryclass,
        categoryName,
        brandImg,
      });

      await subcategory.save();
      res.status(200).send({ message: "success" });
    }
  } catch (e) {
    res.send({ message: "custome error" });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const categories = (await Category.find({})).reverse();
    res.send(categories);
  } catch (e) {
    res.send({ message: "custome error" });
  }
};

export const getSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategories = (await SubCategory.find({})).reverse();
    res.send(subCategories);
  } catch (e) {
    res.send({ message: "custome error" });
  }
};

export const gateDynamicSubCategory = async (req: Request, res: Response) => {
  try {
    const categories = await SubCategory.find({ categoryName: req.params.id });
    res.send(categories);
  } catch (e) {
    res.send({ message: "custome error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const result = await Category.deleteOne({ _id: req.query.id });
    if (result.deletedCount === 1) {
      res.send({ message: "success" });
    } else {
      res.send({ message: "something is wrong" });
    }
  } catch (err) {
    res.send({ message: "Error occurred while deleting user history" });
  }
};
export const deletesubCategory = async (req: Request, res: Response) => {
  try {
    const result = await SubCategory.deleteOne({ _id: req.query.id });
    if (result.deletedCount === 1) {
      res.send({ message: "success" });
    } else {
      res.send({ message: "something is wrong" });
    }
  } catch (err) {
    res.send({ message: "Error occurred while deleting user history" });
  }
};
// get single category

export const getSingleCategory = async (req: Request, res: Response) => {
  try {
    const product = await Category.find({ _id: req.params.id });
    if (!product) {
      return res.send({ message: "custom error" });
    }
    res.status(200).send({
      data: product,
    });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

// update category image

export const updateCategoryImage = async (req: Request, res: Response) => {
  try {
    const { id, categoryThumb } = req.body;
    await Category.updateOne(
      { _id: id },
      {
        $set: {
          categoryThumb: categoryThumb,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};
export const updateBrandImage = async (req: Request, res: Response) => {
  try {
    const { id, brandImg } = req.body;
    await SubCategory.updateOne(
      { _id: id },
      {
        $set: {
          brandImg: brandImg,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

// update basic info

export const updateCategoryInfo = async (req: Request, res: Response) => {
  try {
    const { id, categoryName, categoryclass } = req.body;
    await Category.updateOne(
      { _id: id },
      {
        $set: {
          categoryName,
          categoryclass,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const gateDynamicSubCategoryId = async (req: Request, res: Response) => {
  try {
    const categories = await SubCategory.find({ _id: req.params.id });
    res.send(categories);
  } catch (e) {
    res.send({ message: "custome error" });
  }
};

export const updatesubCategoryInfo = async (req: Request, res: Response) => {
  try {
    const { id, subCategoryName, categoryName, subcategoryclass } = req.body;
    await SubCategory.updateOne(
      { _id: id },
      {
        $set: {
          subCategoryName,
          categoryName,
          subcategoryclass,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

// search brand and category

export const getSearchBrand = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search;
    let keywordArray: string[] = [];
    if (searchQuery && typeof searchQuery === "string") {
      keywordArray = searchQuery.split(",");
    } else if (Array.isArray(searchQuery)) {
      keywordArray = searchQuery as string[];
    }
    const keywordFilter = keywordArray.map((keyword: string) => ({
      $or: [
        { subCategoryName: { $regex: keyword, $options: "i" } },
        { categoryName: { $regex: keyword, $options: "i" } },
      ],
    }));

    const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
    const result = await SubCategory.find(query);
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
export const getSearchCategory = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search;
    let keywordArray: string[] = [];
    if (searchQuery && typeof searchQuery === "string") {
      keywordArray = searchQuery.split(",");
    } else if (Array.isArray(searchQuery)) {
      keywordArray = searchQuery as string[];
    }
    const keywordFilter = keywordArray.map((keyword: string) => ({
      $or: [{ categoryName: { $regex: keyword, $options: "i" } }],
    }));

    const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
    const result = await Category.find(query);
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
