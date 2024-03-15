const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const cloudinary = require("cloudinary");

// create event
router.post(
  "/create-event",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const { name, description, category, start_Date, Finish_Date, tags, originalPrice, discountPrice, stock, images } = req.body;

        // Process images
        const imagesLinks = [];
        for (const image of images) {
          const result = await cloudinary.v2.uploader.upload(image, {
            folder: "events",
          });
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const eventData = {
          name,
          description,
          category,
          start_Date,
          Finish_Date,
          tags,
          originalPrice,
          discountPrice,
          stock,
          images: imagesLinks, // Assign processed images
          shopId,
          shop,
        };

        const event = await Event.create(eventData);

        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);



// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});


// get event by ID
router.get(
  "/get-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const eventId = req.params.id;

      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      res.status(200).json({
        success: true,
        event,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// delete event of a shop
router.delete(
  "/delete-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      
      const event = await Event.findById(req.params.id);

      if (!event) {
        return next(
          new ErrorHandler("Event is not found with this id", 404)
        );
      }

      // await category.remove();
      await Event.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Event Deleted successfully!",
      });
     

     
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);



// all events --- for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
