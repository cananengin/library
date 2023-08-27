const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const Book = require('../models/book');
const Member = require('../models/member');

// Ödünç alma işlemi
router.post('/borrow', async (req, res) => {
  const { memberId, bookId } = req.body;

  try {
    const member = await Member.findById(memberId);
    const book = await Book.findById(bookId);

    if (!member || !book) {
      return res.status(404).json({ message: 'Üye veya kitap bulunamadı.' });
    }

    const transaction = new Transaction({
      memberId,
      bookId,
      borrowedDate: new Date(),
    });
    await transaction.save();

    res.status(201).json({ message: 'Kitap ödünç alındı.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// İade işlemi
router.post('/return', async (req, res) => {
  const { memberId, bookId } = req.body;

  try {
    const transaction = await Transaction.findOne({
      memberId,
      bookId,
      returnedDate: null,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Ödünç alınmış kitap bulunamadı.' });
    }

    transaction.returnedDate = new Date();
    await transaction.save();

    res.json({ message: 'Kitap iade edildi.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
