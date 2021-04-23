const Message = require('../models/Message');
const User = require('../models/User');

class PrepareSentMessageService {
  async constructor(cid, messageText, userId, message = null, chat = null) {
    this.cid = cid;
    this.messageText = messageText;
    this.userId = userId;
    this.message = message;
    this.chat = chat;
    this.sender = await User.findOne({userId}).exec();
    this.messageData = this.setMessageData(cid, messageText, userId)
    
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
