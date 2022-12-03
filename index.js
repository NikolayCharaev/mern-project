import express from 'express'; //библиотека, позволяющая создавать специальный веб-сервер с помощью NodeJS
import mongoose from 'mongoose'; // библиотека MongoDB для коннекта с базой данных, в которой у нас будет храниться вся логика приложения.
import multer from 'multer'; // библиотека для реализации загрузки изображений на сервер

import cors from 'cors' //библиотека для избажания ошибки CORC Policy

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validations/validation.js'; //нужно обязательно указывать формат  в NodeJS
// import * as UserController from './controllers/userController.js';
// import * as PostController from './controllers/postController.js';
import { PostController, UserController } from './controllers/index.js';
import { checkAuth, handleValidationsErrors } from './utils/index.js';

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

const storage = multer.diskStorage({
  // создаем хранилище для наших изображений
  destination: (_, __, cb) => {
    // первые 2 параметра нам не нужны
    cb(null, 'uploads'); // тут мы указываем, что если нет никаких ошибок, то мы сохраняем картинки в папке uploads
  },
  filename: (_, file, cb) => {
    // как будет называться наш файл
    cb(null, file.originalname); // тут мы говорим, что хотим вытащить из нашего файла оригинальное название
  },
});

const upload = multer({ storage }); // объединяем multer и storage
app.use('/uploads', express.static('uploads'));
app.use(express.json()); // для того чтобы express приложение могло понимать логику json :) эта команда позволит читать json, который будет приходить к нам в наших запросах. Без этой команды будет возвращаться undefined
app.use(cors())
app.post('/auth/login', loginValidation, handleValidationsErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationsErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);


app.get('/tags', PostController.getLastTags);
// app.get('/posts/tags', PostController.getLastTags);



app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  try {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Что-то пошло не так',
    });
  }
});

// когда мы создаем Rest Api и у нас есть CRUD, то не надо указывать запросы по типу '/post/delete, post/update' и т.п. Жедательно указывать что у тебя есть один путь и у него есть отдельные методы. Ниже будут примеры
app.get('/posts', PostController.getAll); // Получение всех статей;  Проверять токен нет смысла так что checkAuth можно убрать
app.get('/posts/:id', PostController.getOne); // получение одной статьи
app.delete('/posts/:id', checkAuth, PostController.remove); // удаление статьи
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationsErrors,
  PostController.update,
); // обновление списка статей
app.post('/posts', checkAuth, postCreateValidation, PostController.create); // создание статьи

app.listen(5555, (err) => {
  // прослушивание сервера localhost:5555
  if (err) {
    return console.log(err);
  } else {
    console.log('Server OK');
  }
});
