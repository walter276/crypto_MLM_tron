const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const User_Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
User_Schema.set('toJSON', { getters: true });
User_Schema.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj.__v;
  delete obj._id;
  return obj;
};

module.exports = User = mongoose.model("user", User_Schema);
