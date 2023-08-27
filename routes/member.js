const express = require('express');
const router = express.Router();
const createMemberSchema = require('../validators/memberValidator');
const Member = require('../models/member');
const Transaction = require('../models/transaction')

router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
      const { error } = createMemberSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const member = new Member({
        name: req.body.name,
        email: req.body.email,
      });
  
      const newMember = await member.save();
      res.status(201).json(newMember);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

router.get('/:id', async (req, res) => {
    try {
      const memberId = req.params.id;
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ message: 'Üye bulunamadı.' });
      }
  
      const borrowedBooks = await Transaction.find({ memberId });
      const currentBorrowedBooks = await Transaction.find({ memberId, returnedDate: null });
  
      res.json({
        member,
        borrowedBooks,
        currentBorrowedBooks
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post('/:id/comment', async (req, res) => {
    try {
      const memberId = req.params.id;
      const { bookId, comment } = req.body;
  
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ message: 'Üye bulunamadı.' });
      }
  
      member.comments.push({ bookId, comment });
      await member.save();
  
      res.json({ message: 'Yorum eklendi.' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
