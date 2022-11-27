// создаем контроллер для создания статей
//  тут будет создание статей, удаление, редактирование, получение одной статьи или всех статей сразу :)
import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  // Получение всех статей
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  // Получение одной статьи
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }
        res.json(doc);
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const remove = async (req, res) => {
  // удаление статьи
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          message: 'Статья успешно удалена',
        });
      },
    );
  } catch (err) {
    console.log(err);
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

export const update = async (req, res) => {
  // Обновление статьи
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        // вторым параметром мы передаем то, что именно хотим обновить в нашей статье
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tars: req.body.tags,
      },)
      res.json({
        success: true
      })
} catch (err) {
    console.log(err)
    res.status(500).json({
        message: 'Не удалось обновить статью'
    })
}
};
