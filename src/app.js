const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
// const User = require("./model/user.js");
const userRouter = require("./routes/user.js");

const app = express();
const port = 3000;

//Adding middleware so that it can automatically parse the json to js object

//Here didn't provided the route so that it will run for every request

app.use(express.json());

//Making the cookie parser run on each route call

app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => console.log("Database connected"))
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on port: " + port);
    });
  })
  .catch((err) => console.log("Error connecting to the DB: ", err));
