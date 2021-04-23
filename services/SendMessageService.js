const Message = require('../models/message');
const User = require('../models/user');

class SendMessageService {
  constructor(preparedMessage) {
    this.preparedMessage = preparedMessage;
  }

  static async sendToGroup() {
    const userIdx = preparedMessage.chat.users.findIndex((user) => user.user.toString() === value.userId);
    const response = {
      user: {
        _id: preparedMessage.chat.users[userIdx].user,
        unreadMsgCount: preparedMessage.chat.users[userIdx].unreadMsgCount,
      },
      message: this.preparedMessage.message,
    }

    // send the message to all users of the room including the sender
    preparedMessage.chat.users.forEach((user) => {
      io.in(user.user.toString()).emit('message', response);
    })
  }
}

module.exports = SendMessageService;
