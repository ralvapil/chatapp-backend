const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  users:[
    {
      type: mongoose.Schema.ObjectId, 
      ref: 'User',
      required: false,
    }
  ],
  messages: [
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

