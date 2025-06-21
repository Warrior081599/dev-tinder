const express = require("express");
const { validateSignupData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const User = require("../model/user.js");

const authRouter = express.Router();

//Sign-up API:

authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of the data:

    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password:
    const passwordHash = await bcrypt.hash(password, 10);

    //creating new instance of "User" model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("New User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

//Log-in API:

authRouter.post("/login", async (req, res) => {
  //Destructuring of email and pass
  const { emailId, password } = req.body;

  //checking if the email is there in the DB

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("User email is not present in the DB");
    }
    const isPasswordMatched = await user.validatePassword(password);
    if (isPasswordMatched) {
      //Create a JWT web token:

      const token = await user.getJWT();

      //Add the token to cookie and then send back to the client
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      res.cookie("token", token, {
        expires: new Date(Date.now() + SEVEN_DAYS),
      });
      res.send(user);
    } else {
      throw new Error("Entered password doesnot matched");
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

//Making logout API -

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout Successfully");
});

module.exports = authRouter;
