const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const axios = require("axios")
const Order = require("../model/order")
const User = require("../model/user")
const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);


router.post(
  "/process/:orderId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Processing order:", req.params.orderId);
      const order = await Order.findOne({ _id: req.params.orderId });
      console.log("Order:", order);
      const amount = order.totalPrice * 100; // Ensure amount is in kobo (Paystack expects amount in the smallest currency unit)
      console.log("Order amount:", amount);

      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: order.user.email,
          amount,
          callback_url: `${process.env.BASE_URL}/payment/callback`, // Dynamic callback URL
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const paystackReference = response.data.data.reference;
      console.log("Paystack reference:", paystackReference);

      const data = {
        paymentInfo: {
          paystackRef: paystackReference,
        },
      };

      await Order.findByIdAndUpdate(req.params.orderId, data, { new: true });

      res.status(200).json({
        success: true,
        client_secret: response.data,
        redirect_url: response.data.data.authorization_url, // Paystack URL to redirect user to
      });

    } catch (error) {
      console.error("Error processing order:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
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



router.post(
  "/chatpayment/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.params.userId });
      const { amount } = req.body;

      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: user.email,
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

      await User.findByIdAndUpdate(req.params.userId, data, { new: true });

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
  "/verifyChatPayment/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.params.userId });
      const reference = user.paymentInfo.paystackRef;
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
      let isPaid = false;
      if (response.data.data.status && response.data.data.status == "success") {
        isPaid = true;
      }

      const data = {
        paymentInfo: {
          status: response.data.data.status,
          paystackRef: response.data.data.reference,
          isPaid,
          paidAt: response.data.data.paid_at,
        },
      };

      await User.findByIdAndUpdate(req.params.userId, data);

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