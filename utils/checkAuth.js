import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s/, ''); //  в переменную token мы записываем пароль из header-ов и проверем, есть он или нет.
  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123'); // если же токен есть, мы должны его расшифровать с помощью jwt.verify. В него мы передаем токен и ключ расшифровки
      req.userId = decoded._id; // если токен расшифрован, мы его запихиваем в res.userId
      next(); // c помощью next() мы продолжаем считывать дальнейший код
    } catch (err) {
      //оповещение о провале, если токена не существует или еще что-либо прошло не так
      res.status(403).json({
        message: 'Ошибка доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};
