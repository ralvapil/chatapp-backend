const UserService = require("../services/UserService");
const ContactListService = require("../services/ContactListService");

const userController = {
  async addContact(data, callback) {
    if (data?.email?.length > 0) {
      const result = await ContactListService.addContact(data.email, data.user);
      return callback(result);
    }

    return callback(null);
  },

  async getUserContacts(data, callback) {
    const contactList = await ContactListService.getUserContactListPopulated(
      data.user
    );
    console.log("cl", contactList);
    return callback(contactList);
  },
};

module.exports = userController;
