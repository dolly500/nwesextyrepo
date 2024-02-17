const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const axios = require("axios")
const Order = require("../model/order")
// const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

router.post(
  "/process/:orderId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findOne({ _id: req.params.orderId });
      const amount = order.totalPrice

      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: order.user.email,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = {
        paymentInfo: {
          paystackRef: response.data.data.reference,
        }
      };

      await Order.findByIdAndUpdate(req.params.orderId, data, { new: true });

      res.status(200).json({
        success: true,
        client_secret: response.data,
      });

    } catch (error) {
      // Handle errors here
      res.status(400).json({
        success: error.status,
        message: error.message,
      });;
    }
  })

);

router.put(
  "/verify/:orderId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findOne({ _id: req.params.orderId });
      const reference = order.paymentInfo.paystackRef;
      if (!reference)
        return res.status(400).send({ message: 'Reference not found' })
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = {
        paymentInfo: {
          status: response.data.data.status,
          paystackRef: response.data.data.reference
        },
        paidAt: response.data.data.paid_at,
      };

      await Order.findByIdAndUpdate(req.params.orderId, data);

      res.status(200).json({
        success: true,
        client_secret: response.data,
      });

    } catch (error) {
      // Handle errors here
      res.status(400).json({
        success: error.status,
        message: error.message,
      });;
    }
  })

);

router.get(
  "/paystackapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ paystackApikey: process.env.PAYSTACK_API_KEY });
  })
);


module.exports = router;