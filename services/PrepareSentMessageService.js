const Message = require('../models/message');
const User = require('../models/user');

class PrepareSentMessageService {
  constructor(cid, messageText, userId, message = null, chat = null) {
    this.cid = cid;
    this.messageText = messageText;
    this.userId = userId;
    this.message = message;
    this.chat = chat;
    this.sender;
    this.messageData = this.setMessageData(cid, messageText, userId)
  }

  async prepare() {
    this.sender = await User.findOne({userId}).exec();
    this.createMessage();
    this.addMessageToChat();
  }

  setMessageData(cid, messageText, userId) {
    this.messageData = {
      chat: cid,
      value: messageText,
      user: userId,
      senderName: `${sender.firstName} ${sender.lastName}`
    };
  }

  static async createMessage() {
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
    this.chat = await Chat.findOne({ _id: this.cid }, function(err, res) {
      if(res.recentMsgs.length > 20) {
        res.recentMsgs.shift();
      }
      res.recentMsgs.push(message);
      res.save();
    });
  }
}

module.exports = PrepareSentMessageService;
