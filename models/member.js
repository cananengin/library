const mongoose = require('../db');

const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  comments: [{ bookId: mongoose.Types.ObjectId, comment: String }],
});

memberSchema.virtual('borrowedBooks', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'memberId'
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;