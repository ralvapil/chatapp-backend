const Chat = require('../models/chat');
const mongoose = require('mongoose');

class ChatService {
  static async getUserChats ( userId ) {
    try { 
      return await Chat.find({ "users.user": mongoose.Types.ObjectId(userId) }).exec();
    } catch(err) {
      // TODO error handling
      return null;
    }
  }

  static async getChatHistory( cid ) {
    //get the messages from the db
    const chatLoadTest = await Chat.findOne({ _id:cid });
    const chats = await 
    Chat
      .findOne({ _id:cid })
      .exec();


    // TODO: figure out which of these to use
    console.log('sending convos', chats);
    callback(chats)

    console.log('chatLoad test', chatLoadTest);
    callback({ chat: chats });
    // numOfMessages = chatLoadTest.messages.length > 20 ? 20 : chatLoadTest.messages.length;
  }

  static async getChat ( cid ) {
    try{
      return await Chat
        .findOne({ _id: cid })
    } catch(err) {
      // TODO error handling
      return null;
    }
  }
}

module.exports = ChatService;