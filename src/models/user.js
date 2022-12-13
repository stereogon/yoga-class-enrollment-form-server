const mongoose = require("mongoose");
const { isMobilePhone } = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    min: [18, "You must be 18 or more for this program."],
    max: [65, "You must be less than 65 for this program."],
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "We need to know your Gender."],
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.pre("save", function (next) {
  if (isMobilePhone(this.mobile, ["en-IN"])) {
    next();
  } else {
    throw new Error("invalid-mobile");
  }
});

module.exports = mongoose.model("user", userSchema);
