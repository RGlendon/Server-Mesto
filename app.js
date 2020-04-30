const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then((status) => console.log(`MongoDB успешно подключен. Ресурсы: ${Object.keys(status.models)}`))
  .catch(() => console.log('Не удается подключиться к MongoDB. Запустите базу данных'));

app.use((req, res, next) => {
  req.user = {
    _id: '5ea452372dc8ee31ec775b09',
  };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/:nonexistentPage', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listens port ${PORT}`);
});
