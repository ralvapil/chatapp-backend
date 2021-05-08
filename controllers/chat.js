const ChatService = require('../services/ChatService')
const CreateChatService = require('../services/CreateChatService')

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
  },

  async readMessage(data, callback) {
    const { cid, message, user } = data;
    const chat = await ChatService.userReadMessage(cid, message, user);

    // send updated chat
    callback(chat)
  },

  async checkChatExists(data) {
    console.log('in check exists', data)
    const chat = await CreateChatService.create(data.user, data.contact)
  },

  async createChat(data, callback) {
    const chat = await CreateChatService.create(data.user, data.contact)

    // loop through each chat member and refresh their chats
    await Promise.all(
      chat.users.forEach(async(user) => {
        const convos = await this.getConvos(user.user);
        io.in(user.user.toString()).emit('newConvosPushed', convos);
      })
    )

    callback(chat);
  }
}

module.exports = chatController;
