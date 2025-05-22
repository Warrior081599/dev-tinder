const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./model/user.js");

const app = express();
const port = 3000;

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Azad",
    lastName: "Raj",
    emailId: "azad@raj.com",
    password: "123@Aza",
  };

  //creating new instance of "User" model
  const user = new User(userObj);

  try {
    await user.save();
    res.send("New User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

connectDB()
  .then(() => console.log("Database connected"))
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on port: " + port);
    });
  })
  .catch((err) => console.log("Error connecting to the DB: ", err));
