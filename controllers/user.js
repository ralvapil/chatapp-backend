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
  }
}

module.exports = userController;