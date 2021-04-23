const PrepareSentMessageService = require('../services/PrepareSentMessageService')
const SendMessageService = require('../services/SendMessageService')

const messageController = {
  async sendMessage(data) {
    const preparedMessage = PrepareSentMessageService(data.cid, data.message, data.userId);
    await preparedMessage.prepare();

    const sendMessageService = SendMessageService(preparedMessage);
    await sendMessageService.sendToGroup();
  },
}

module.exports = messageController;