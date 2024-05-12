const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Category = require("../model/category");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const fs = require("fs").promises;

router.post("/test/image", async (req, res) => {
  // Upload image to Cloudinary
  const data = req.files.image;
  // Save the file to a temporary location
  const tempFilePath = path.join(__dirname, "../uploads", data.name);
  await data.mv(tempFilePath);
  console.log(data);
  const result = await cloudinary.v2.uploader.upload(tempFilePath, {
    // Optionally, specify any upload options here
  });
  await fs.unlink(tempFilePath);
  res.json({ data, result });
});

// create category
router.post(
  "/create-category",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, images } = req.body;
      // Process images
      const imagesLinks = [];
      for (const image of images) {
        const result = await cloudinary.v2.uploader.upload(image, {
          folder: "category",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      const categoryData = {
        name,
        description,
        images: imagesLinks, // Assign processed images
      };

      const category = await Category.create(categoryData);

      res.status(201).json({
        success: true,
        category,
        message: `Category created!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get categories
router.get(
  "/",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const categorys = await Category.find({});

      res.status(201).json({
        success: true,
        categorys,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// edit a category
router.put(
  "/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const categoryId = req.params.id;

      await Category.findByIdAndUpdate(categoryId, req.body, { new: true });

      res.status(200).json({
        success: true,
        message: "Updated succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete category
router.delete(
  "/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return next(
          new ErrorHandler("Category is not found with this id", 404)
        );
      }

      // await category.remove();
      await Category.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Category Deleted successfully!",
      });
    } catch (error) {
      console.log(new ErrorHandler(error, 400));
      return next(new ErrorHandler(error, 400));
    }
  })
);
// get Category by ID
router.get(
  "/get-all-category/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const categoryId = req.params.id;

      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

//Categories for admin

router.get(
  "/all-categories",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Assuming you have a Category model
      const categories = await Category.find();

      res.status(200).json({
        success: true,
        categories: categories,
      });
    } catch (error) {
      console.error("Fetch categories error:", error);
      return next(new ErrorHandler("Failed to fetch categories", 500));
    }
  })
);

module.exports = router;
