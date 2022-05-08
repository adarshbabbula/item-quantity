const mongoose = require("mongoose");

const schema = mongoose.Schema;

const datesQuantitySchema = new schema({
  date: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    default: 0
  },
  itemId: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("DatesQuantity", datesQuantitySchema);
