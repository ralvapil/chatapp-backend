const ChatService = require('../services/ChatService')
const CreateChatService = require('../services/CreateChatService')

const chatController = {
  async getConvos(user, callback) {
    const chats = await ChatService.getUserChats(user.user);
    console.log(chats)
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

  async sendIsTyping(data, isTyping, io) {
    const chat = await ChatService.getChat(data.cid)

    chat.users
      .filter((user) => user.user.toString() !== data.user)
      .forEach( async (user) => {
        io.in(user.user.toString()).emit(isTyping ? 'memberIsTyping' : 'memberEndTyping', { 
          user: data.user,
          cid: data.cid,
        });
        console.log('send typing emitted')
      })
  },

  async createChat(data, callback, io) {
    console.log('in create', data)
    const chat = await CreateChatService.create(data.user, data.members)
    console.log('chat after', chat)
    // loop through each chat member and refresh their chats
    

    chat.users.forEach( async(user) => {
      console.log('sending for user', user)
      const convos = await ChatService.getUserChats(user.user);
      console.log('convos sent', convos)
      io.in(user.user.toString()).emit('newConvosPushed', { 
        user: user.user, convos
      });
      console.log('convo emitted')
    })
    

    callback(chat._id);
  }
}

module.exports = chatController;
