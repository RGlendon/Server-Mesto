const validator = require('validator');


const validatePassword = (value) => {
  const regExp = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*/;

  if (!regExp.test(value)) {
    throw new Error('Пароль должен содержать как минимун одну прописную и заглавную буквы, цифру. Минимальная длина 8 символов');
  }

  return value;
};

const validateUrl = (value) => {
  if (!validator.isURL(value)) {
    throw new Error('введите URL в формате: http://my-site.ru/...');
  }

  return value;
};


module.exports = {
  validatePassword,
  validateUrl,
};
