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
    messageController.sendMessage(data, io, callback);
  })

  socket.on('readMessage', async (data, callback) => {
    chatController.readMessage(data, callback);
  })

  socket.on('addContact', async (data, callback) => {
    userController.addContact(data, callback);
  })
}

module.exports = getSocketRoutes;

