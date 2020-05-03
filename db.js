const mongoose = require("mongoose")

const newSchema = mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  short: {
    type: Number,
    required: true
  }
})
module.exports = mongoose.model("model", newSchema)