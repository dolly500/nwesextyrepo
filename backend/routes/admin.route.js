const router = require("express").Router();
const adminController = require("../controller/adminController");


router.get("/admin", async (req, res, next) => {
    res.send({ message: "Restricted to admin only👾" });
  });
  
  // Define user routes
router.post("/admin/auth/signup", adminController.signupAdmin);
router.post("/admin/auth/login", adminController.signInAdmin);
router.post("/admin/auth/logout", adminController.logoutUser);
router.post('/admin/auth/forgot-password', adminController.forgotPassword);
router.post('/admin/auth/reset-password', adminController.resetPassword);



module.exports = router;