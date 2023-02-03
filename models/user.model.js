// Packages:
const mongoose = require('mongoose')


// Schema:
const UserSchema = new mongoose.Schema({
  accountNumber: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
})


// Model:
const UserModel = mongoose.model('User', UserSchema)


// Exports:
module.exports = UserModel
