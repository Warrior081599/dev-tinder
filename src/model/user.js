const mongoose = require("mongoose");
const { Schema } = mongoose;

//Defining a schema:

//Applying schmea validation given by mongoose....

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 1,
      maxLength: 50,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    about: {
      type: String,
      default: "This is default about section....",
      minLength: 1,
      maxLength: 200,
    },
    skills: {
      type: [String],
      maxLength: 50,
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Not a valid gender like (male,female or others) ");
        }
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
