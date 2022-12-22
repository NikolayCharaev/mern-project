import UserModel from '../models/User.js';
import bcrypt from 'bcrypt'; // библиотека для шифрования паролей

import jwt from 'jsonwebtoken'; // библиотека которая генерирует специальный токен, с помощью которого мы может позже обращаться к защищенным запросам на нашем приложении. С помощью токена я смогу понять: авторизован ли я, могу ли я создавать и удалять статьи и т.п. В двух словах это специальный ключ для доступа к моей ячейке.
import { validationResult } from 'express-validator'; // позволяет нам проверить нашу валидацию на ошибки

export const login = async (req, res) => {
  // запрос на авторизацию
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); // проверяем сходство паролей
    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }
    const token = jwt.sign(
      {
        _id: user._id, // если мы узнаем id - этой информации хватит для того чтобы в дальнейшем проверять авторизован ли пользователь, кто пользователь и т.п
      },
      'secret123', // ключ благодаря которому мы сможем расшифровать токен
      {
        expiresIn: '30d', // третьим параметром мы указываем через сколько времени наш токен перестанет быть валидным
      },
    );

    const { passwordHash, ...userData } = user._doc; // достаем с помощью деструктуризации пароль пользователя для того чтобы он не отображался в mongoDB
    res.json({
      // возвразаем json объект с токеном и данными нового пользователя
      userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const register = async (req, res) => {
  // передаем вторым параметром registerValidation для того что-бы введенные нами данные прошли валидацию
  try {
    // // оборачиваем код в try/ catch чтобы приложение не вылетало в случае ошибки
    // const errors = validationResult(req); // передаем req в validationResult для проверки на ошибки
    // if (!errors.isEmpty()) {
    //   // проверка переменной errors на пустоту
    //   return res.status(400).json(errors.array()); // в случае ошибки возвращаем все ощибки в формате json для ознакомления
    // }

    const password = req.body.password; // вытаскиваем пароль для его шифрования
    const salt = await bcrypt.genSalt(10); // переменная salt это что-то вроде алгоритма шифрования нашего пароля
    const pass = await bcrypt.hash(password, salt); // в новую переменную мы передаем наш пароль и алгоритм шифрования

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: pass, // мы должны зашифровать пароль. Пароль не должен быть в открытом виде. для этого устанавливаем библиотеку bcrypt
    });

    const user = await doc.save(); // создаем самого пользователя в mongoDB. Для этого говорим что наш документ необходимо сохранить в базе данных

    // после завершения регистрации пользователя нам необходимо вернуть jwt токен
    const token = jwt.sign(
      {
        _id: user._id, // если мы узнаем id - этой информации хватит для того чтобы в дальнейшем проверять авторизован ли пользователь, кто пользователь и т.п
      },
      'secret123', // ключ благодаря которому мы сможем расшифровать токен
      {
        expiresIn: '30d', // третим параметром мы указываем через сколько времени наш токен перестанет быть валидным
      },
    );

    const { passwordHash, ...userData } = user._doc; // достаем с помощью деструктуризации пароль пользователя для того чтобы он не отображался в mongoDB

    res.json({
      // возвразаем json объект с токеном и данными нового пользователя
      userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const getMe = async (req, res) => {
  // chechAuth выступает в качестве функции посредника для проверки на наличие пароля. Это говорит о том, что при запросе функция checkAuth будет решать, выполнять ли дальнейший код или нет.
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(403).json({
        message: 'Пользователь не найден',
      });
    }
    const { passwordHash, ...userData } = user._doc; // достаем с помощью деструктуризации пароль пользователя для того чтобы он не отображался в mongoDB

    res.json({
      // возвразаем json объект с токеном и данными нового пользователя
      userData,
    });
  } catch (err) {
    console.log(err);
  }
};

// app.get('/', (req, res) => { // создаем роут
//   res.send('Привет, мир!'); // отобрази
// });

// app.post('/auth/login',(req, res) => { // req - request(то что приходит к нам из сервера) res - responce (то что мы отправляем на сервер)
//     console.log(req.body)
//     const token = jwt.sign({ // при ипсользовании запроса у нас генерируется jwt-токен, который в свою очередь будет шифровать email который я введу и мои инициалы
//         email: req.body.email,
//         fullname : 'Николай Чараев'
//     }, 'secret123') // специальный ключ с помощью которого я смогу в дальнейшем расшифровать инфу
//     res.json({
//         success: true,
//         token
//     })
// })
