const chatController = require('../controllers/chat')
const messageController = require('../controllers/message')
const userController = require('../controllers/user')
const message = require('../models/message')

const getSocketRoutes = (socket, io) => {
  socket.on('getConvos', async (user, callback) =>  {
    chatController.getConvos(user, callback)
  })

  socket.on('getMessageHistory', async (value, callback) => 
    chatController.getMessageHistory(value, callback)
  )

  socket.on('sendMessage', async (data, callback) => {
    messageController.sendMessage(data, io, socket, callback);
  })

  socket.on('readMessage', async (data, callback) => {
    chatController.readMessage(data, callback);
  })

  socket.on('addContact', async (data, callback) => {
    userController.addContact(data, callback);
  })

  socket.on('getContacts', async (data, callback) => {
    userController.getUserContacts(data, callback);
  })

  socket.on('createChat', async (data, callback) => {
    console.log('data', data)
    chatController.createChat(data, callback, io);
  })

  socket.on('checkChatExists', async(data) => {
    console.log('received in routes')
    chatController.checkChatExists(data);
  })
}

module.exports = getSocketRoutes;

