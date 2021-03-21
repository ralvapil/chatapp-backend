const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  chat:{
    type: mongoose.Schema.ObjectId, 
    ref: 'Chat',
    required: true,
  },
  message: [
    {
      value: String,
      timestamp: { 
        type: Date, 
        default: Date.now,
      },
      user: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        required: false,
      },
      name: String,
    }
  ],
  nickname: String,
})
  
module.exports = mongoose.model('Chat', chatSchema);

