const express = require("express");
const router = express.Router();

const controller = require("../controllers/apiController");

router.post("/getUserByWalletAddress", controller.getUserByWalletAddress);

module.exports = router;
