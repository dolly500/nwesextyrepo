const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Category = require("../model/category");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const upload = require("../middleware/multer")
const path = require("path");
const fs = require('fs').promises;

router.post('/test/image', async (req, res) => {
    // Upload image to Cloudinary
    const data = req.files.image
    // Save the file to a temporary location
    const tempFilePath = path.join(__dirname, '../uploads', data.name);
    await data.mv(tempFilePath);
    console.log(data)
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

            const { name, description, } = req.body;
            const uploadedFile = req.files.image
            // Save the file to a temporary location
            const tempFilePath = path.join(__dirname, '../uploads', uploadedFile.name);
            await uploadedFile.mv(tempFilePath);
            const result = await cloudinary.v2.uploader.upload(tempFilePath, {
                // Optionally, specify any upload options here
            });
            await fs.unlink(tempFilePath);

            const newCategory = {
                name,
                description,
                imageUrl: result.url
            }
            const data = await Category.create(newCategory);

            res.status(201).json({
                data,
                success: true,
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
    "/create-new-review",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { user, rating, comment, categoryId, orderId } = req.body;

            const category = await Product.findById(categoryId);

            const review = {
                user,
                rating,
                comment,
                categoryId,
            };

            const isReviewed = category.reviews.find(
                (rev) => rev.user._id === req.user._id
            );

            if (isReviewed) {
                category.reviews.forEach((rev) => {
                    if (rev.user._id === req.user._id) {
                        (rev.rating = rating), (rev.comment = comment), (rev.user = user);
                    }
                });
            } else {
                category.reviews.push(review);
            }

            let avg = 0;

            category.reviews.forEach((rev) => {
                avg += rev.rating;
            });

            category.ratings = avg / category.reviews.length;

            await category.save({ validateBeforeSave: false });

            await Order.findByIdAndUpdate(
                orderId,
                { $set: { "cart.$[elem].isReviewed": true } },
                { arrayFilters: [{ "elem._id": categoryId }], new: true }
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

// delete category
router.delete(
    "/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
                return next(new ErrorHandler("Category is not found with this id", 404));
            }

            // await category.remove();
            await Category.findByIdAndDelete(req.params.id)

            res.status(201).json({
                success: true,
                message: "Category Deleted successfully!",
            });
        } catch (error) {
            console.log(new ErrorHandler(error, 400))
            return next(new ErrorHandler(error, 400));
        }
    })
);

module.exports = router;
