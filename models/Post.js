// в этом файле будет структура нашей таблицы списка пользователей

import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    // в этой схеме мы опишем все свойства, которые могут быть у пользователя
    title: {
      // тут мы просто указываем настройки, которые должны быть у свойства fullname
      type: String, // у свойства fullname тип должен быть обязательно строкой
      required: true, // свойство fullname обязательно к заполнению
    },
    text: {
      type: String, //почта должна быть строкой
      required: true, //почта - обязательное поле
      unique: true, // имя почты должно быть уникальным, т.е не дольжно быть 2 одинаковых почт
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: String, // url аватарки должен быть строкой
  },
  {
    timestamps: true, //тут мы указываем, что нам необходимо дополнительно указывать дату создания и обновления пользователя
  },
);

// Если мы хотим указать что есть определенный тип и он обязателен к заполнению то мы передаем объект настройки, в другом случае поступаем как с аватаркой

export default mongoose.model('Post', PostSchema);
