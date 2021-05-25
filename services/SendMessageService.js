class SendMessageService {
  constructor(preparedMessage) {
    this.preparedMessage = preparedMessage;
  }

  async sendToGroup(io) {
    const userIdx = this.preparedMessage.chat.users.findIndex(
      (user) =>
        user.user.toString() === this.preparedMessage.sender._id.toString()
    );

    // remove recent messages in chat from message sent
    this.preparedMessage.setRecentMsgs([]);

    //send the message to all users except sender
    this.preparedMessage.chat.users.forEach((user) => {
      if (user.user.toString() !== this.preparedMessage.sender._id.toString()) {
        io.in(user.user.toString()).emit(
          "message",
          this.getUserMessage(user.user)
        );
      }
    });
  }

  getUserMessage(user) {
    return {
      user: {
        _id: user,
      },
      message: this.preparedMessage.message,
      chat: this.preparedMessage.chat,
    };
  }
}

module.exports = SendMessageService;
