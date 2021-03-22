const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  users:[{
    user: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        required: false,
    },
    firstName: {
      type: String,
      required: true
    },
    lastReadMsg: {
      type: mongoose.Schema.ObjectId, 
      ref: 'Message',
      required: false,
    },
    unreadMsgCount: {
      type: Number,
      required: true,
    }
  }],
  recentMsgs:[
    {
      _id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Message',
        required: true,
      },
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
      senderName: String,
      required: false,
    }
  ],
  nickname: {
    type: String,
    required: false,
  },
})
  
module.exports = mongoose.model('Chat', chatSchema);

