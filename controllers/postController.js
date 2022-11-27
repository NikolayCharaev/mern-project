// создаем контроллер для создания статей
//  тут будет создание статей, удаление, редактирование, получение одной статьи или всех статей сразу :)
import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();



    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
        message: 'Не удалось получить статьи'
    })
  }
};

export const create = async (req, res) => {
  // метод создания нового поста
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};
