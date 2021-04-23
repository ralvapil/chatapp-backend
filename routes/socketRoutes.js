const chatController = require('../controllers/chat')
const messageController = require('../controllers/message')
const userController = require('../controllers/user')

const getSocketRoutes = () => {
  socket.on('getConvos', async (user, callback) =>  
    chatController.getConvos(user, callback)
  )

  socket.on('getMessageHistory', async (value, callback) => 
    chatController.getMessageHistory(value, callback)
  )

  socket.on('sendMessage', async (data) => {
    messageController.sendMessage(data);
  })

}

module.exports = getSocketRoutes;

