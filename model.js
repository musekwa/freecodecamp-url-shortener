const mongoose = require("mongoose")
const shortid = require("shortid")

const schema = mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
    default: shortid.generate
  }
})


module.exports = mongoose.model("model", schema)