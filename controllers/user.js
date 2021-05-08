const UserService = require('../services/UserService')
const ContactListService = require('../services/ContactListService')

const userController = {
  async addContact(data, callback) {
    if(data?.email?.length > 0) {
      const contactList = await ContactListService.addContact(data.email, data.user);
      console.log('contact list', contactList)
      return callback(contactList);
    }

    return callback(null)
  },

  async getUserContacts(data, callback) {
    const contactList = await ContactListService.getUserContactList(data.user);
    console.log('cl', contactList)
    return callback(contactList);
  }
}

module.exports = userController;