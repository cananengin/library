const mongoose = require('mongoose');

mongoose.connect('Lütfen kendi MongoDB urlinizi kullanın.', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB bağlantısı başarılı');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB bağlantı hatası:', err);
});

module.exports = mongoose;
