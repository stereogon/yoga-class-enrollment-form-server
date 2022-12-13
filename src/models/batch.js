const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new Schema({
  batchId: {
    type: Number,
    required: [true, "Please Select a Batch"],
    unique: true,
  },
  startHour: {
    type: Number,
    required: true,
  },
  endHour: {
    type: Number,
    required: true,
  },
  AMPM: {
    type: String,
    enum: ["AM", "PM"],
    required: true,
  },
});

module.exports = mongoose.model("batch", batchSchema);
