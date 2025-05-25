const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./model/user.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { validateSignupData } = require("./utils/validation.js");

const app = express();
const port = 3000;

//Adding middleware so that it can automatically parse the json to js object

//Here didn't provided the route so that it will run for every request

app.use(express.json());

//Making the cookie parser run on each route call

app.use(cookieParser());

//Sign-up API:

app.post("/signup", async (req, res) => {
  try {
    //Validation of the data:

    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password:
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

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

app.post("/login", async (req, res) => {
  //Destructuring of email and pass
  const { emailId, password } = req.body;

  //checking if the email is there in the DB

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("User email is not present in the DB");
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (isPasswordMatched) {
      //Create a JWT web token:

      //Add the token to cookie and then send back to the client

      res.cookie("token", "xhdwijdiwJAIJSWI8ishissi979.#$%ij");
      res.send("Login Successfully");
    } else {
      throw new Error("Entered password doesnot matched");
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

//Making a profile API:

app.get("/profile", async (req, res) => {
  try {
    const getCookie = req.cookies;
    console.log(getCookie);
    res.send(getCookie);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Getting a single user from the DB :

//User - Model of the schema, db
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const singleUser = await User.find({ emailId: userEmail });
    if (!singleUser.length) {
      res.status(400).send("No Users Found");
    } else {
      res.send(singleUser);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Getting all the users - will use /feed as route

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (!allUsers.length) {
      res.status(400).send("Users not found");
    } else {
      res.send(allUsers);
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

//Using findOne method of mongoose :

app.get("/findOne", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const oneUser = await User.findOne({ emailId: userEmail });

    if (oneUser.length === 0) {
      res.status(400).send("User not found in DB");
    } else {
      res.send(oneUser);
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err);
  }
});

//Using findById :

app.get("/findById", async (req, res) => {
  const userId = req.body._id;
  try {
    const userById = await User.findById(userId);

    if (!userById) {
      res.status(400).send("User not found");
    } else {
      res.send(userById);
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err);
  }
});

//Making a delete HTTP method and will use findByIdAndDelete()

app.delete("/user", async (req, res) => {
  const userId = req.body.id;

  try {
    const deletedItem = await User.findByIdAndDelete({ _id: userId });
    console.log("Deleted Item: " + deletedItem);
    if (!deletedItem) {
      res.status(400).send("User not found in the DB");
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err);
  }
});

//Making an update HTTP method API: Using findByIdAndUpdate

app.patch("/user/:userId", async (req, res) => {
  let userId = req.params?.userId;
  let updatedValue = req.body;

  const user = await User.findByIdAndUpdate(userId, updatedValue, {
    runValidators: true,
  });
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(updatedValue).every((ele) =>
      ALLOWED_UPDATES.includes(ele)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (updatedValue?.skills?.length > 10) {
      throw new Error("Skills can't be more than 10");
    }

    if (!userId?.length) {
      res.status(400).send("User not present in the DB");
    } else {
      res.send("user updated successfully");
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err);
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
