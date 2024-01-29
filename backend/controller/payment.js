const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const myPayment = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: req.body.email,
        amount: req.body.amount,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
   
    )
    res.json(myPayment.data);
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
    
  })
  
);

router.get(
  "/paystackapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ paystackApikey: process.env.PAYSTACK_API_KEY });
  })
);


module.exports = router;