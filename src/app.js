const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./model/user.js");

const app = express();
const port = 3000;

//Adding middleware so that it can automatically parse the json to js object

//Here didn't provided the route so that it will run for every request

app.use(express.json());

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
    const ALLOWED_UPDATES = ["about", "gender", "age", "skills"];
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

app.post("/signup", async (req, res) => {
  //creating new instance of "User" model
  const user = new User(req.body);

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
