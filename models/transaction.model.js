// Packages:
const mongoose = require('mongoose')


// Schema:
const TransactionSchema = new mongoose.Schema({
  from: {
    type: Number,
    required: true
  },
  to: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
})


// Model:
const TransactionModel = mongoose.model('Transaction', TransactionSchema)


// Exports:
module.exports = TransactionModel
