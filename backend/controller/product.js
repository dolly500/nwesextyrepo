const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Category = require("../model/category");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const Event = require("../model/event");
const path = require("path");
const fs = require('fs').promises;

// create product
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
          const { name, description, category, categoryId, tags, originalPrice, discountPrice, stock, shopId, shop, images, sold_out, ratings, reviews} = req.body;

           // Process images
        const imagesLinks = [];
        for (const image of images) {
          const result = await cloudinary.v2.uploader.upload(image, {
            folder: "products",
          });
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const productData = {
          name,
          description,
          category,
          categoryId,
          tags,
          sold_out,
          ratings,
          reviews,
          originalPrice,
          discountPrice,
          stock,
          images: imagesLinks, // Assign processed images
          shopId,
          shop,
        };

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


// get product by ID
router.get(
  "/get-product/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);





// Delete a product from a shop
router.delete(
  "/delete-product/:productId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.productId;

      // Find the product by ID and remove it
      const product = await Product.findById(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      // If the product is associated with a category, remove it from the category's products array
       // Delete images associated with the event from Cloudinary
       for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }

      await Event.findByIdAndDelete(productId);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully"
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.delete(
  "/delete-product/:id",
  
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.params.id;
      
      const shop = await Product.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Product not found with this id", 404));
      }

      // Delete images associated with the event from Cloudinary
      for (let i = 0; i < shop.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(shop.images[i].public_id);
      }

      await Product.findByIdAndDelete(shopId);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully🤡",
        deletedEvent: shop // Optionally return the deleted event for reference
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);


// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find();

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
