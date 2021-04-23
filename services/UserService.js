const User = require('../models/user');

class UserService {
  constructor() {
    this.modelInstance = User;
  }

  static getUser ( id ) {
    try { 
      return this.modelInstance.findById(id);
    } catch(err) {
      // TODO error handling
      return null;
    }
  }

  static findByGoogleIdOrCreate (profile) {
    this.modelInstance.findOne({googleId : profile.id},function(err,result){ 
      if(!result){
        user.firstName = profile.name.givenName;
        user.lastName = profile.name.familyName;
        user.googleId = profile.id
        user.email = profile.emails[0].value; 

        user.save(callback);
      }else{
        callback(err, result);
      }
  });
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
