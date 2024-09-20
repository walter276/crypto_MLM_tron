const axios = require("axios");
const User = require("../models/User");

exports.getUserByWalletAddress = async (req, res) => {
  const { walletAddress } = req.body;
  try {
    if (!walletAddress) {
      return res.status(400).json({type: "failed", message: 'Please provide wallet address.' });
  }

  const user = await User.findOne({ walletAddress });

  if (!user) {
      return res.status(401).json({type: "failed", message: 'Invalid credentials.' });
  }

    res.status(201).json({type: "success", message: 'User fatching successfully.', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({type: "failed",  message: "user fatching failed." });
  }
};
