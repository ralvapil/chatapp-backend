const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    required: false
  },
  // notes: [ { type: mongoose.Schema.ObjectId, ref: 'Note' } ]
})

userSchema.statics.findOrCreate = function(profile, callback) {
  console.log('profile', profile)

  const user = new this();

  this.findOne({googleId : profile.id},function(err,result){ 
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

module.exports = mongoose.model('User', userSchema);

