const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enrollmentSchema = new Schema({
  id: {
    type: String,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: "program",
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("enrollment", enrollmentSchema);
