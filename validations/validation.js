import { body } from 'express-validator'; // библиотека для валидации информации перед созданием пользователя.

export const registerValidation = [
  body('email', 'введен некорректный email адрес').isEmail(), // почта должна быть почтой
  body('password', 'слишком короткий пароль').isLength({ min: 5 }), // у пароля должно быть минимум 5 символов
  body('fullName', 'неправильное имя пользователя').isLength({ min: 3 }), // минимум 3 символа
  body('avatarUrl', 'некорректная ссылка на изображение').optional().isURL(), // optional означает что это свойство не обязательно, a isURL проверяет, является ли это ссылкой
];


// валидация для авторизации 
export const loginValidation = [
  body('email', 'введен некорректный email адрес').isEmail(), // почта должна быть почтой
  body('password', 'слишком короткий пароль').isLength({ min: 5 }), // у пароля должно быть минимум 5 символов
];

// валидация для создания постов
export const postCreateValidation = [
  body('title', 'введите заголовок статьи').isLength({min:3}).isString(),
  body('text', 'введите текст статьи').isLength({min:3}).isString(),
  body('tags', 'введите формать тэгов (укажите массив)').optional().isString(),
  body('imageUrl', 'неверная ссылка на изображение').optional().isString(),
];
