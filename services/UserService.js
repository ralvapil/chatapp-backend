const User = require('../models/user');
const ContactListService = require('./ContactListService');

class UserService {
  static async getUser ( id ) {
    try { 
      return await User.findById(id);
    } catch(err) {
      // TODO error handling
      return null;
    }
  }

  static async getUserByEmail ( email ) {
    try {
      return await User.findOne({ email });
    } catch(err) {
      return null
    }
  }

  static async findByGoogleIdOrCreate (profile) {
    console.log('profile', profile)
    let user = await User.findOne({googleId : profile.id})

    if(!user) {

      user = new User();
      console.log('user', user, profile)
      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
      user.googleId = profile.id
      user.email = profile.emails[0].value; 
      user.picture = profile?.photos[0]?.value;
      
      await user.save();

      // TODO: create contactlist should be using another service
      const contactList = await ContactListService.create(user._id);
    }

    return user;
  }
}

module.exports = UserService;

// userSchema.statics.findOrCreate = function(profile, callback) {
//   console.log('profile', profile)

//   const user = new this();

//   this.findOne({googleId : profile.id},function(err,result){ 
//       if(!result){
//         user.firstName = profile.name.givenName;
//         user.lastName = profile.name.familyName;
//         user.googleId = profile.id
//         user.email = profile.emails[0].value; 

//         user.save();
//         return user;
//       }else{
//         return result;
//       }
//   });
// }
