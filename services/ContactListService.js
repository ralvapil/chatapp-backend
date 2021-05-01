const User = require('../models/user');
const ContactList = require('../models/contactList')
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
    return await 
      ContactList
        .findOne({user: mongoose.Types.ObjectId(user)})
        .populate('contacts.user').exec();
  }
}

module.exports = ContactListService;