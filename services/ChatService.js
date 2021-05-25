const Chat = require("../models/chat");
const mongoose = require("mongoose");

class ChatService {
  static async getUserChats(userId) {
    console.log("chats");
    try {
      console.log("find", userId);
      return await Chat.find({
        "users.user": mongoose.Types.ObjectId(userId),
      }).exec();
    } catch (err) {
      // TODO error handling
      return null;
    }
  }

  static async getChatHistory(cid) {
    //get the messages from the db
    const chatLoadTest = await Chat.findOne({ _id: cid });
    const chats = await Chat.findOne({ _id: cid }).exec();

    // TODO: figure out which of these to use
    console.log("sending convos", chats);
    callback(chats);

    console.log("chatLoad test", chatLoadTest);
    callback({ chat: chats });
    // numOfMessages = chatLoadTest.messages.length > 20 ? 20 : chatLoadTest.messages.length;
  }

  static async getChat(cid) {
    try {
      return await Chat.findOne({ _id: mongoose.Types.ObjectId(cid) });
    } catch (err) {
      // TODO error handling
      return null;
    }
  }

  static async userReadMessage(cid, message, reader) {
    const chat = await this.getChat(cid);

    chat.users.forEach((user, idx) => {
      // set reader unread count to 0 and update last read message
      if (user.user == reader) {
        chat.users[idx].unreadMsgCount = 0;
        chat.users[idx].lastReadMsg = mongoose.Types.ObjectId(message._id);
      }
    });
    return await chat.save();
  }
}

module.exports = ChatService;
