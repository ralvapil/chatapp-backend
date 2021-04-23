const Chat = require('../models/Chat');

class ChatService {
  constructor() {
    this.modelInstance = Chat;
  }

  static async getUserChats ( userId ) {
    try { 
      return await this.modelInstance.find({ "users.user": mongoose.Types.ObjectId(userId) });
    } catch(err) {
      // TODO error handling
      return null;
    }
  }

  static async getChat ( cid ) {
    try{
      return await this.modelInstance
        .findOne({ _id: cid })
    } catch(err) {
      // TODO error handling
      return null;
    }
  }
}

module.exports = ChatService;