const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const programSchema = new Schema({
  month: {
    type: String,
    required: true,
  },
  batch: {
    type: Schema.Types.ObjectId,
    ref: "batch",
    required: [true, "Please Select a batch"],
  },
});

module.exports = mongoose.model("program", programSchema);
