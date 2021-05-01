const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  user: {
      type: mongoose.Schema.ObjectId, 
      ref: 'User',
      required: true,
  },
  contacts: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      nickname: {
        type: String,
        required: false
      },
    }
  ],
})
  
module.exports = mongoose.model('Contacts', contactsSchema);

