const User = require('../models/user');
const Chat = require('../models/chat')
const mongoose = require('mongoose');
const ContactListService = require('../services/ContactListService')

class CreateChatService {
  static async create ( user, members ) {
    console.log('test', members)
    const typedContacts = members.map((member) => mongoose.Types.ObjectId(member));

    try {
      const chats = await Chat.find({
        'users.user': {
          $all: [
            mongoose.Types.ObjectId(user), 
            ...typedContacts
          ]
        }
      })
      // loop through chats and check if users.length == 2 and one is contact
      const filteredChats = chats.filter((chat) => chat.users.length === members.length + 1);

      console.log('filtered'. filteredChats)

      if(filteredChats?.length === 0) {
        console.log('in filtered', members, typeof members)
      //   // TODO: this code is completely untested
        const memberInstances = await Promise.all(
          members.map( 
            async (member) => { 
              console.log('member', member)
              return await User.findById(mongoose.Types.ObjectId(member))
            }
          )
        );
        const userInstance = await User.findById(mongoose.Types.ObjectId(user));

        const users = [
          {
            user: userInstance._id, 
            firstName: userInstance._firstName, 
            unreadMsgCount: 0  
          },
          memberInstances.map((member) => (
            {
              user: member._id,
              firstName: member.firstName,
              unreadMsgCount: 0
            }
          ))
        ];

        console.log('user', users)
      //   // create the chat
        const newChat = new Chat({
          users: [ 
            {
              user: userInstance._id, 
              firstName: userInstance.firstName, 
              lastName: userInstance.lastName,
              unreadMsgCount: 0  
            },
            ...memberInstances.map((member) => (
              {
                user: member._id,
                firstName: member.firstName,
                lastName: member.lastName,
                unreadMsgCount: 0
              }
            ))
          ],
          isGroup: [user, ...typedContacts].length > 2
        });
        console.log('new chat', newChat)

        await newChat.save()

        return newChat;
      }

      return filteredChats[0];

        // push chat to all users
        // newChat.users.forEach((user) => {
        //     io.in(user.user.toString()).emit('newConvosPushed', newChat);
        // })

    } catch(err) {
      return null
    }
  }
}

module.exports = CreateChatService;