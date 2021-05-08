const User = require('../models/user');
const Chat = require('../models/chat')
const mongoose = require('mongoose');
const ContactListService = require('../services/ContactListService')

class CreateChatService {
  static async create ( user, contacts ) {
    const typedContacts = contacts.map((contact) => mongoose.Types.ObjectId(contact));

    try {
      const chats = await Chat.find({ 
        'users.user': 
          {"$in": 
            [ 
              mongoose.Types.ObjectId(user), 
              [...typedContacts]
            ]
          }
      })

      // loop through chats and check if users.length == 2 and one is contact
      const filteredChats = chats.filter((chat) => chat.users.length === contacts.length + 1);

      if(filteredChats?.length === 0) {
        // TODO: this code is completely untested
        const contactInstance = await User.findById(mongoose.Types.ObjectId(contact));
        const userInstance = await User.findById(mongoose.Types.ObjectId(user));

        // create the chat
        const newChat = new Chat({
          users: [ 
            {
              user: contactInstance._id, 
              firstName: contactInstance._firstName, 
              unreadMsgCount: 0  
            },
            {
              user: userInstance._id, 
              firstName: userInstance._firstName, 
              unreadMsgCount: 0  
            },
          ]
        });

        await newChat.save()

        // push chat to all users
        // newChat.users.forEach((user) => {
        //     io.in(user.user.toString()).emit('newConvosPushed', newChat);
        // })

        return newChat;
        // return chat
      } else {
        // return existing chat
        return filteredChats[0];
      }

    } catch(err) {
      return null
    }
  }
}

module.exports = CreateChatService;