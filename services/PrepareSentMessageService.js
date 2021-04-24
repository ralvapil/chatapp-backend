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
    await this.incrementUnreadMsgCount();
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

  async incrementUnreadMsgCount() {
    // update unread messages for each user in chat upon message preparation
    this.chat.users.forEach(async (val, idx) => {
      await Chat.updateOne(
        {_id: this.chat._id,},
        { 
          $inc: {
           [`users.${idx}.unreadMsgCount`]: 1
          }
        }
      )
    })
  }

  async setRecentMsgs(recentMsgs) {
    this.chat.recentMsgs = recentMsgs;
  }
}

module.exports = PrepareSentMessageService;