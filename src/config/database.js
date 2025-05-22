const mongoose = require("mongoose");
const MONGODB_NAMSTENODE_DEVTINDER = require("./constants");

const connectDB = async () => {
  await mongoose.connect(MONGODB_NAMSTENODE_DEVTINDER);
};

module.exports = connectDB;
