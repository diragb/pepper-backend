// Packages:
const express = require('express')
const cors = require("cors")
const mongoose = require('mongoose')


// Models:
const UserModel = require('./models/user.model')
const TransactionModel = require('./models/transaction.model')


// Constants:
const app = express()
const PORT = process.env.PORT || 4000


// Initializations:
app.use(cors({
  origin: ['http://localhost:3000', 'https://pepper-bank-salt.web.app/', 'https://pepper-bank-salt.firebaseapp.com/' ]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb+srv://admin:admin@pepper.nttbbpo.mongodb.net/?retryWrites=true&w=majority').then(async () => {
  console.log('Connected!')
})
app.listen(PORT, () => {
  console.log(`Server Started at ${ PORT }`)
})

// Routes:
app.get('/fetchUser', async (req, res) => {
  const { accountNumber } = req.query
  const users = await UserModel.find({ 'accountNumber': parseInt(accountNumber) })
  res.json({ status: 'ok', data: { user: users[0] } })
})

app.get('/fetchAllUsers', async (_req, res) => {
  const users = await UserModel.find({ userType: 'USER' })
  res.json({ status: 'ok', data: { users } })
})

app.get('/fetchTransactions', async (req, res) => {
  const { accountNumber } = req.query
  const transactions = await TransactionModel.find({ $or: [ { 'from': parseInt(accountNumber) }, { 'to': parseInt(accountNumber) } ] })
  res.json({ status: 'ok', data: { transactions } })
})

app.post('/transferFunds', async (req, res) => {
  const from = req.body.from
  const to = req.body.to
  const amount = req.body.amount
  await UserModel.findOneAndUpdate({ 'accountNumber': parseInt(from) }, { $inc: { 'amount': -parseInt(amount) } })
  await UserModel.findOneAndUpdate({ 'accountNumber': parseInt(to) }, { $inc: { 'amount': parseInt(amount) } })
  const transaction = new TransactionModel({ from, to, amount })
  await transaction.save()
  res.json({ status: 'ok' })
})

app.post('/deposit', async (req, res) => {
  const accountNumber = req.body.accountNumber
  const amount = req.body.amount
  await UserModel.findOneAndUpdate({ 'accountNumber': parseInt(accountNumber) }, { $inc: { 'amount': parseInt(amount) } })
  const transaction = new TransactionModel({ from: 0, to: accountNumber, amount })
  await transaction.save()
  res.json({ status: 'ok' })
})

app.post('/withdraw', async (req, res) => {
  const accountNumber = req.body.accountNumber
  const amount = req.body.amount
  await UserModel.findOneAndUpdate({ 'accountNumber': parseInt(accountNumber) }, { $inc: { 'amount': -parseInt(amount) } })
  const transaction = new TransactionModel({ from: 0, to: accountNumber, amount })
  await transaction.save()
  res.json({ status: 'ok' })
})
