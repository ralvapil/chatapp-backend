const ChatService = require('../services/ChatService')

const chatController = {
  getConvos(user, callback) {
    console.log('received request for convos', user);

    const chats = await ChatService.getUserChats(user.user);

    console.log('sending convos', chats);
    callback(chats) 
  },
  getMessageHistory() {
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
