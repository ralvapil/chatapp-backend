const user = require('../models/user');
const User = require('../models/user');

class UserService {
  static async getUser ( id ) {
    try { 
      return await User.findById(id);
    } catch(err) {
      // TODO error handling
      return null;
    }
  }

  static async findByGoogleIdOrCreate (profile) {
    const user = await User.findOne({googleId : profile.id})

    if(!user) {
      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
      user.googleId = profile.id
      user.email = profile.emails[0].value; 

      await user.save();
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
