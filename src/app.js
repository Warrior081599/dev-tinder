const express = require("express");

const app = express();
const port = 3000;

/**
 app.use("/test",(req,res,next) => {
  console.log("Route Handler 1");
  next()
})
 */

app.get("/user", (req, res) => {
  res.send("User api requested for the user data");
});

//Making a dummy auth middleware for admin

app.use("/admin", (req, res, next) => {
  const token = 12345;

  if (token === 12345) {
    next();
  } else {
    res.status(401).send("The client is not an admin");
  }
});

app.get("/admin/user-data", (req, res) => {
  res.send("User data sent");
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
