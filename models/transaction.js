const mongoose = require('../db');

const transactionSchema = new mongoose.Schema({
  memberId: mongoose.Types.ObjectId,
  bookId: mongoose.Types.ObjectId,
  borrowedDate: Date,
  returnedDate: Date,
  rating: Number,
  comment: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
