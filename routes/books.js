const express = require('express');
const router = express.Router();
const createBookSchema = require('../validators/bookValidator');
const Book = require('../models/book');
const Transaction = require('../models/transaction');

// Tüm kitapları listele
router.get('/', async (req, res) => {
    try {
      const books = await Book.find();
  
      const booksWithRatingsAndComments = await Promise.all(books.map(async (book) => {
        const transactions = await Transaction.find({ bookId: book._id });
  
        // Ortalama değerlendirme puanını hesapla
        const totalRatings = transactions.reduce((total, transaction) => total + transaction.rating, 0);
        const avgRating = transactions.length > 0 ? totalRatings / transactions.length : 0;
  
        // Üye yorumlarını al
        const comments = [];
        transactions.forEach((transaction) => {
          if (transaction.comment) {
            comments.push({
              memberId: transaction.memberId,
              comment: transaction.comment
            });
          }
        });
  
        return {
          _id: book._id,
          title: book.title,
          author: book.author,
          avgRating,
          comments
        };
      }));
  
      res.json(booksWithRatingsAndComments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Tek bir kitabı listele
router.get('/:id', async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ message: 'Kitap bulunamadı.' });
      }
  
      const transactions = await Transaction.find({ bookId });
      const totalRatings = transactions.reduce((total, transaction) => total + transaction.rating, 0);
      const avgRating = transactions.length > 0 ? totalRatings / transactions.length : 0;
  
      const comments = [];
      transactions.forEach((transaction) => {
        if (transaction.comment) {
          comments.push({
            memberId: transaction.memberId,
            comment: transaction.comment
          });
        }
      });
  
      res.json({
        _id: book._id,
        title: book.title,
        author: book.author,
        avgRating,
        comments
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
  try {
    const { error } = createBookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Şema doğrulamasını geçtikten sonra kitap oluşturma işlemini devam ettirin
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
    });

    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
