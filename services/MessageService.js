const Message = require('../models/Message');

class MessageService {
  constructor() {
    this.modelInstance = Message;
  }

  static async create(messageData) {
    const message = new Message(messageData);

    try { 
      await message.save();
      return message;
    } catch(err) {
      // TODO error handling
      return null;
    }
  }

}

module.exports = MessageService;
