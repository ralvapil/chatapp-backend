const PrepareSentMessageService = require('../services/PrepareSentMessageService')
const SendMessageService = require('../services/SendMessageService')

const messageController = {
  sendMessage(data) {
    const preparedMessage = await PrepareSentMessageService(data.cid, data.message, data.userId);
    const sendMessageService = SendMessageService(preparedMessage);

    sendMessageService.sendToGroup();
  },
}

module.exports = messageController;