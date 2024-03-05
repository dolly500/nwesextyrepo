const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Post = require("../model/post");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const cloudinary = require("cloudinary");

 router.post(
  "/create-post",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const { title, description, category, status, tags, shopId, shop, images } = req.body;
        
        // Process images
        const imagesLinks = [];
        for (const image of images) {
          const result = await cloudinary.v2.uploader.upload(image, {
            folder: "posts",
          });
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const postData = {
          title,
          description,
          category,
          tags,
          status,
          images: imagesLinks, // Assign processed images
          shopId,
          shop,
        };
        const post = await Post.create(postData);

        res.status(201).json({
          success: true,
          post,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all posts
router.get("/get-all-posts", async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(201).json({
      success: true,
      posts,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all posts of a shop
router.get(
  "/get-all-posts/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const posts = await Post.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        posts,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete Post of a shop
router.delete(
  "/delete-shop-Post/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return next(new ErrorHandler("Post is not found with this id", 404));
      }    

      for (let i = 0; 1 < post.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          post.images[i].public_id
        );
      }
    
      await Post.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Post Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all posts --- for admin
router.get(
  "/admin-all-posts",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const posts = await Post.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        posts,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
