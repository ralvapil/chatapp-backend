const User = require("../models/user");
const ContactList = require("../models/contactList");
const Chat = require("../models/chat");

const mongoose = require("mongoose");

class ContactListService {
  static async create(user) {
    try {
      const cl = new ContactList();
      cl.user = mongoose.Types.ObjectId(user);
      cl.contacts = [];

      return await cl.save();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async addContact(email, user) {
    try {
      const newContact = await User.findOne({ email: email.trim() });
      console.log("newcontact", newContact);
      if (!newContact) {
        // newContact user does not exist
        return { status: "failed", data: null };
      }

      // check if user already exists in contact list

      const contactList = await this.getUserContactList(user);
      // console.log('contact', contactList.contacts[0].user.email,  email)
      const isAlreadyExists =
        contactList.contacts.length > 0
          ? contactList.contacts.filter(
              (contact) => contact.user.email === email
            ).length > 0
          : false;

      // insert into contact list
      if (!isAlreadyExists) {
        contactList.contacts.push({ user: newContact._id });
        console.log(contactList);
        await contactList.save();

        //refresh populated list
        return { status: "success", data: await this.getUserContactList(user) };
      }
      console.log("already exists");
      return { status: "failed", data: contactList };
    } catch (err) {
      return null;
    }
  }

  static async getUserContactList(user) {
    return await ContactList.findOne({ user: mongoose.Types.ObjectId(user) })
      .populate("contacts.user")
      .exec();
  }

  static async getUserContactListPopulated(user) {
    console.log("in fn user", user);

    const contactList = await this.getUserContactList(user);
    console.log("cl test", contactList);
    const { contacts } = contactList;

    console.log("in fn contacts", contacts);

    const contactListWithChats = await Promise.all(
      contacts.map(async (contact, index) => {
        // const chats = await Chat.find({
        //   'users.user':
        //     {"$eq":
        //       [
        //         mongoose.Types.ObjectId(user),
        //         mongoose.Types.ObjectId(contact.user._id)
        //       ]
        //     }
        // })

        const chats = await Chat.find({
          "users.user": {
            $all: [
              mongoose.Types.ObjectId(user),
              mongoose.Types.ObjectId(contact.user._id),
            ],
          },
        });

        console.log("chattt", chats);

        const retContact = {
          firstName: contact.user.firstName,
          lastName: contact.user.lastName,
          user: contact.user._id,
          _id: contact._id,
          picture: contact.user.picture,
        };

        // loop through chats and check if users.length == 2 and one is contact
        const filteredChats = chats.filter((chat) => chat.users.length === 2);

        if (filteredChats?.length > 0) {
          retContact.chat = { _id: filteredChats[0]._id };
        }

        return retContact;
      })
    );

    console.log("can you", contactListWithChats);

    return contactListWithChats;
  }

  static async getUserContact(user, userToCheck) {
    const { contacts } = await this.getUserContactListPopulated(user);
    const contact = contacts.filter(
      (contact) => contact.user._id.toString() === userToCheck
    );

    return contact;
  }
}

module.exports = ContactListService;
