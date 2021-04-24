const Message = require('../models/message');
const User = require('../models/user');
const Chat = require('../models/chat');

const mongoose = require('mongoose');

class PrepareSentMessageService {
  constructor(cid, messageText, userId, message = null) {
    this.cid = mongoose.Types.ObjectId(cid);
    this.messageText = messageText;
    this.userId = mongoose.Types.ObjectId(userId);
    this.message = message;
    this.chat;
    this.sender;
    this.messageData;
  }

  async prepare() {
    this.sender = await User.findOne(this.userId).exec();
    this.setMessageData()
    await this.createMessage();
    await this.addMessageToChat();
  }

  setMessageData() {
    this.messageData = {
      chat: this.cid,
      value: this.messageText,
      user: this.userId,
      senderName: `${this.sender.firstName} ${this.sender.lastName}`
    };
  }

  async createMessage() {
    this.message = new Message(this.messageData);

    try { 
      await this.message.save();
      return this.message;
    } catch(err) {
      // TODO error handling
      return null;
    }
  }

  async addMessageToChat() {
    this.chat = await Chat.findOne(this.cid).exec();

    if(this.chat.recentMsgs.length > 20) {
      this.chat.recentMsgs.shift();
    }

    this.chat.recentMsgs.push(this.message);
    await this.chat.save();
  }
}

module.exports = PrepareSentMessageService;