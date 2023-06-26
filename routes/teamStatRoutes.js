const express = require("express");
const teamStat = require("../controllers/teamStatController");
const authController = require("../controllers/authController");
const transactionController = require("../controllers/transactionController");


const router = express.Router();

router.use(authController.protect);

router
    .route('/')
    .get(teamStat.teamStat)


module.exports = router;
