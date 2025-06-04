const express = require("express");
const { userAuth } = require("../middleware/auth.js");

const requestRouter = express.Router();

//Making send connection request API:

requestRouter.post("/send-connection-request", userAuth, async (req, res) => {
  const user = req.user;

  //Sending the connection request:

  res.send(user.firstName + " sent the coonection request");
});

module.exports = requestRouter;
