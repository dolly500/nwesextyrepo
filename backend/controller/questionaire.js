const express = require("express");
const router = express.Router();
const Questionnaire = require("../model/questionaire");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// Create a new questionnaire
router.post(
  "/create-questionnaire",
  catchAsyncErrors(async (req, res) => {
    try {
    const { religion, gender, relationshipStatus,  helpReason, optionsAvailable,consultationFee, therapyType } = req.body;
    

      const questionnaire = new Questionnaire({
        religion,
        gender,
        relationshipStatus,
        helpReason,
        optionsAvailable,
        consultationFee,
        therapyType
      });

      await questionnaire.save();

      res.status(201).json({
        success: true,
        message: "Questionnaire created successfully🙂",
        data: questionnaire
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  })
);

// Read all questionnaires
router.get(
  "/get-all-questionnaire",
  catchAsyncErrors(async (req, res) => {
    try {
      const questionnaires = await Questionnaire.find();
      res.status(200).json({
        success: true,
        message: "Questionnaires retrieved successfully",
        data: questionnaires
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  })
);

// Read a single questionnaire by ID
router.get(
  "/get-all-questionnaire/:id",
  catchAsyncErrors(async (req, res) => {
    try {
      const questionnaire = await Questionnaire.findById(req.params.id);
      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: "Questionnaire not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "Questionnaire retrieved successfully",
        data: questionnaire
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  })
);

// Update a questionnaire by ID
router.put(
  "/:id",
  catchAsyncErrors(async (req, res) => {
    try {
      const { religion, gender, relationshipStatus,  helpReason, optionsAvailable,consultationFee, therapyType } = req.body;
      const questionnaire = await Questionnaire.findByIdAndUpdate(
        req.params.id,
        {
          religion,
          gender,
          relationshipStatus,
          helpReason,
          optionsAvailable,
          consultationFee,
          therapyType
          
        },
        { new: true, runValidators: true }
      );

      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: "Questionnaire not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Questionnaire updated successfully",
        data: questionnaire
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  })
);

// Delete a questionnaire by ID
router.delete(
  "/:id",
  catchAsyncErrors(async (req, res) => {
    try {
      const questionnaire = await Questionnaire.findByIdAndDelete(req.params.id);
      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: "Questionnaire not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "Questionnaire deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  })
);

  
module.exports = router;