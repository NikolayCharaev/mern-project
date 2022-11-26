import express from 'express'; //библиотека, позволяющая создавать специальный веб-сервер с помощью NodeJS
import jwt from 'jsonwebtoken'; // библиотека которая генерирует специальный токен, с помощью которого мы может позже обращаться к защищенным запросам на нашем приложении. С помощью токена я смогу понять: авторизован ли я, могу ли я создавать и удалять статьи и т.п. В двух словах это специальный ключ для доступа к моей ячейке.
import mongoose from 'mongoose'; // библиотека MongoDB для коннекта с базой данных, в которой у нас будет храниться вся логика приложения.

import { registerValidation } from './validations/auth.js'; //нужно обязательно указывать формат  в NodeJS
import { validationResult } from 'express-validator'; // позволяет нам проверить нашу валидацию на ошибки

import bcrypt from 'bcrypt'; // библиотека для шифрования паролей

import UserModel from './models/User.js';

mongoose
  .connect(
    'mongodb+srv://admin:wwwwww@cluster0.m6dkocn.mongodb.net/blog?retryWrites=true&w=majority',
  ) // объясняю mongoose к какому серверу я хочу подключиться
  .then(() => {
    // если соединение прошло успешно - сработает этот код
    console.log('DB OK');
  })
  .catch((err) => console.log(err)); // код сработает при ошибке

const app = express();
app.use(express.json()); // для того чтобы express приложение могло понимать логику json :) эта команда позволит читать json, который будет приходить к нам в нажих запросах. Без этой команды будет возвращаться undefined

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

app.post('/auth/register', registerValidation, async (req, res) => {
  // передаем вторым параметром registerValidation для того что-бы введенные нами данные прошли валидацию
  try { // оборачиваем код в try/ catch чтобы приложение не вылетало в случае ошибки
    const errors = validationResult(req); // передаем req в validationResult для проверки на ошибки
    if (!errors.isEmpty()) {
      // проверка переменной errors на пустоту
      return res.status(400).json(errors.array()); // в случае ошибки возвращаем все ощибки в формате json для ознакомления
    }

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
    const token = jwt.sign({
        _id: user._id   // если мы узнаем id - этой информации хватит для того чтобы в дальнейшем проверять авторизован ли пользователь, кто пользователь и т.п
    },'secret123',// ключ благодаря которому мы сможем расшифровать токен
        {
            expiresIn: '30d' // третим параметром мы указываем через сколько времени наш токен перестанет быть валидным
        }
    ) 

    const {passwordHash, ...userData} = user._doc // достаем с помощью деструктуризации пароль пользователя для того чтобы он не отображался в mongoDB

    res.json({ // возвразаем json объект с токеном и данными нового пользователя
        userData, 
        token
    }); 
  } catch (err) {
    console.log(err)
    res.status(500).json({
        message: 'Не удалось зарегистрироваться'
    })
  }
});




app.listen(5555, (err) => {
  // прослушивание сервера localhost:5555
  if (err) {
    return console.log(err);
  } else {
    console.log('Server OK');
  }
});
