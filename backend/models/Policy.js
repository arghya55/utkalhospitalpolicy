const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({

  title: String,

  description: String,

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },

  order:{
    type:Number,
    default:0,
  },

}, {
  timestamps: true,
});

module.exports =
  mongoose.models.Policy ||
  mongoose.model("Policy", policySchema);