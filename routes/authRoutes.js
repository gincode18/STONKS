const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/resendOtp", authController.resendOtp);
router.post("/verify", authController.verify);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//Protect all routes after this middleware
router.use(authController.protect);

router.post("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.delete("/deleteMe", userController.deleteMe);

router.get("/user", userController.getAllUsers);


router
  .route("/users/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
