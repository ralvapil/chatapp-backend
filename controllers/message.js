const PrepareSentMessageService = require('../services/PrepareSentMessageService')
const SendMessageService = require('../services/SendMessageService')

const messageController = {
  async sendMessage(data, io, callback) {
    const preparedMessage = new PrepareSentMessageService(data.cid, data.message, data.userId);
    await preparedMessage.prepare();
    
    const senderUnreadCount = preparedMessage.chat.users.filter((convoUser) => convoUser.user.toString() === data.userId)[0].unreadMsgCount;

    // send the update chat back to the sender
    callback({
      message: preparedMessage.message,
      unreadMsgCount: senderUnreadCount,
      cid: data.cid
    });

    // send the message to the other users of the chat
    const sendMessageService = new SendMessageService(preparedMessage);
    await sendMessageService.sendToGroup(io);
  },
}

module.exports = messageController;