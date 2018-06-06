var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//Define a schema
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true // remove both-side white space
  },
  phone: {
    type: String,
    required: true,
    trim: true // remove both-side white space
  },
  email: {
    type: String,
    unique: true, // unique data lik pk
    required: true,
    trim: true // remove both-side white space
  },
  password: {
    type: String,
    required: true,
    trim: true // remove both-side white space
  },
  role: {
    type: String,
    default: 'ADMIN'
  },
});

//hashing a password before saving it to the database
UserSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
  next();
});

UserSchema.statics.compare=function(cleartext, encrypted){
  return bcrypt.compareSync(cleartext, encrypted);
};


module.exports = mongoose.model('Users', UserSchema);
