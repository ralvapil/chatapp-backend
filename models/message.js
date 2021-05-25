const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  chat: {
    type: mongoose.Schema.ObjectId,
    ref: "Chat",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false,
  },
  senderName: String,
  value: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
