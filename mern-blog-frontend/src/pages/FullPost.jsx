import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios'

import { useParams } from 'react-router-dom';

export const FullPost = () => {
  const [data, setData] = useState();
  const [isLoading, setIsloading] = useState(true)
  useEffect(() =>  {
    axios.get(`posts/${id}`)
      .then(res => { 
        setData(res.data)
        setIsloading(false)
      }).catch(err => {
        console.warn(err)
        alert('Ошибка при получении статьи')
      }) 
  },[])
  const { id } = useParams();
  if (isLoading) { 
    return <Post isLoading={isLoading} isFullPost/> 
  } else {
  return (
    <>
      <Post
        _id={data._id}
        title={data.title}
        imageUrl={`http://localhost:5555${data.imageUrl}`}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost>
        <p>
        <ReactMarkdown children={data.text} />
        {/* {data.text} */}
        </p>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: 'Вася Пупкин',
              avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
            },
            text: 'Это тестовый комментарий 555555',
          },
          {
            user: {
              fullName: 'Иван Иванов',
              avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
            },
            text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
          },
        ]}
        isLoading={false}>
        <Index />
      </CommentsBlock>
    </>
  );
};
}
