const Chat = require("../models/chat");

class ChatHistoryService {
  constructor() {
    this.modelInstance = Chat;
  }

  static async getUserChats(userId) {
    try {
      return await this.modelInstance.find({
        "users.user": mongoose.Types.ObjectId(userId),
      });
    } catch (err) {
      // TODO error handling
      return null;
    }
  }
}

module.exports = ChatHistoryService;
