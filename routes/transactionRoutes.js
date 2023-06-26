const express = require("express");
const transactionController = require("../controllers/transactionController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
    .route('/')
    .get(transactionController.getAllTransactions)
    .post(transactionController.addTransaction);

module.exports = router;
