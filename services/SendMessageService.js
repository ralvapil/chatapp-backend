class SendMessageService {
  constructor(preparedMessage) {
    this.preparedMessage = preparedMessage;
  }

  async sendToGroup(io) {
    const userIdx = this.preparedMessage.chat.users.findIndex((user) => user.user.toString() === this.preparedMessage.sender._id.toString());

    // remove recent messages in chat from message sent
    this.preparedMessage.setRecentMsgs([]);

    const response = {
      user: {
        _id: this.preparedMessage.chat.users[userIdx].user,
        unreadMsgCount: this.preparedMessage.chat.users[userIdx].unreadMsgCount,
      },
      message: this.preparedMessage.message,
      chat: this.preparedMessage.chat
    }

    // send the message to all users of the room including the sender
    this.preparedMessage.chat.users.forEach((user) => {
      io.in(user.user.toString()).emit('message', response);
    })
  }
}

module.exports = SendMessageService;
