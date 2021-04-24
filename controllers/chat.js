const ChatService = require('../services/ChatService')

const chatController = {
  async getConvos(user, callback) {
    const chats = await ChatService.getUserChats(user.user);
    callback(chats) 
  },
  async getMessageHistory() {
    console.log('received message history request', value)
    //get the messages from the db
    const chat = await ChatService.getChat(value.cid);
    console.log('chats', chat);

    // TODO not sure which callback is used?
    callback(chat)
    callback({ chat });
  }
}

module.exports = chatController;
