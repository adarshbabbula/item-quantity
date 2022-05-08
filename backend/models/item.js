const mongoose = require("mongoose");

const schema = mongoose.Schema;

const itemSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0
  },
  datesQuantity: [{
    type: schema.Types.ObjectId,
    ref: "DatesQuantity",
  }],
  avgRate: {
    type: Number,
    default:0
  },
  totalRate: {
    type: Number,
    default:0
  },
  totalAmount: {
    type:Number,
    default:0
  }
});

module.exports = mongoose.model("Item", itemSchema);
