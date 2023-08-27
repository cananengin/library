const express = require('express');
const bodyParser = require('body-parser');
const memberRoutes = require('./routes/member');
const bookRoutes = require('./routes/books');
const transactionRoutes = require('./routes/transaction');

const app = express();
app.use(bodyParser.json());

app.use('/members', memberRoutes);
app.use('/books', bookRoutes);
app.use('/transactions', transactionRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Bir hata oluştu.' });
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.listen(3000, () => {
  console.log('Server çalışıyor...');
});
