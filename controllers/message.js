const PrepareSentMessageService = require('../services/PrepareSentMessageService')
const SendMessageService = require('../services/SendMessageService')

const messageController = {
  async sendMessage(data, io) {
    const preparedMessage = new PrepareSentMessageService(data.cid, data.message, data.userId);
    await preparedMessage.prepare();

    const sendMessageService = new SendMessageService(preparedMessage);
    await sendMessageService.sendToGroup(io);
  },
}

module.exports = messageController;