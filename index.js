import express from 'express'; //библиотека, позволяющая создавать специальный веб-сервер с помощью NodeJS
import mongoose from 'mongoose'; // библиотека MongoDB для коннекта с базой данных, в которой у нас будет храниться вся логика приложения.
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validations/validation.js'; //нужно обязательно указывать формат  в NodeJS
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/userController.js';
import * as PostController from './controllers/postController.js';

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
app.use(express.json()); // для того чтобы express приложение могло понимать логику json :) эта команда позволит читать json, который будет приходить к нам в наших запросах. Без этой команды будет возвращаться undefined

app.post('/auth/login', loginValidation, UserController.login);

app.post('/auth/register', registerValidation, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);

// когда мы создаем Rest Api и у нас есть CRUD, то не надо указывать запросы по типу '/post/delete, post/update' и т.п. Жедательно указывать что у тебя есть один путь и у него есть отдельные методы. Ниже будут примеры
app.get('/posts', PostController.getAll) // Получение всех статей;  Проверять токен нет смысла так что checkAuth можно убрать
// app.get('/posts/:id', checkAuth, PostController.getOne) // получение одной статьи
// app.delete('/posts', checkAuth, PostController.remove)  // удаление статьи
// app.patch('/posts', checkAuth, PostController.update) // обновление списка статей
app.post('/posts', checkAuth, postCreateValidation, PostController.create); // создание статьи

app.listen(5555, (err) => {
  // прослушивание сервера localhost:5555
  if (err) {
    return console.log(err);
  } else {
    console.log('Server OK');
  }
});
