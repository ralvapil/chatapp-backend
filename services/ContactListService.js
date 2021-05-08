const User = require('../models/user');
const ContactList = require('../models/contactList')
const Chat = require('../models/chat')

const mongoose = require('mongoose');

class ContactListService {
  static async addContact ( email, user ) {
    try {
      const newContact = await User.findOne({ email });
      console.log('newcontact', newContact)
      if(!newContact) {
        // newContact user does not exist
        return null;
      }

      // check if user already exists in contact list
      const contactList = await this.getUserContactList(user)
      const isAlreadyExists = contactList.length > 0 ? contactList.filter((contact) => contact.user.email === email).length > 0 : false;

      // insert into contact list
      if(!isAlreadyExists) {
        contactList.contacts.push({user: newContact._id});
        await contactList.save();

        //refresh populated list
        return await this.getUserContactList(user);
      }

      return contactList;
    } catch(err) {
      return null
    }
  }

  static async getUserContactList(user) {
    const contactList = await 
      ContactList
        .findOne({user: mongoose.Types.ObjectId(user)})
        .populate('contacts.user')
        .exec();

    const { contacts } = contactList;

    const contactListWithChats = await Promise.all(
      contacts.map(async (contact, index) => {
        const chats = await Chat.find({ 
          'users.user': 
            {"$in": 
              [ 
                mongoose.Types.ObjectId(user), 
                mongoose.Types.ObjectId(contact.user._id) 
              ]
            }
        })

        const retContact = {
          firstName: contact.user.firstName,
          lastName: contact.user.lastName,
          user: contact.user._id,
          _id: contact._id
        }

        // loop through chats and check if users.length == 2 and one is contact
        const filteredChats = chats.filter((chat) => chat.users.length === 2);

        if(filteredChats?.length > 0) {
          retContact.chat = { _id: filteredChats[0]._id }
        }

        return retContact;
      })
    )

    console.log('can you', contactListWithChats)

    return contactListWithChats;
  }

  static async getUserContact(user, userToCheck) {
    const { contacts } = await this.getUserContactList(user);
    const contact = contacts.filter((contact) => contact.user._id.toString() === userToCheck);

    return contact;
  }
}

module.exports = ContactListService;