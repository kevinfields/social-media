import React, { useState, useEffect } from "react";
import formatTime from "../functions/formatTime";
import Comment from "./Comment";

const Post = (props) => {

  const [coms, setComs] = useState([]);
  let comments = [];
  const getComments = async () => {
    await props.commentRef.get().then(snap => {
      snap.forEach(doc => {
        comments.push(doc.data())
      })
    });
  }

  const addComment = async () => {

    const text = prompt('Write a comment')

    let data;
    let id;

    await props.commentRef.add({
      author: props.browser,
      createdAt: new Date(),
      likes: [],
      dislikes: [],
      text: text,
    }).then(() => {
      getComments().then(() => {
        setComs(comments);
      })
    });

    await props.userRef.get().then((doc) => {
      data = doc.data();
    });

    console.log(JSON.stringify(data));
    await props.userRef.set({
        ...data,
        comments: data.comments.concat(comments[comments.length - 1].id)
    })
  
   

  }

  useEffect(() => {
    getComments().then(() => {
      setComs(comments)
    });
  }, [])
  return (
    <div className="post">
      <p>{props.text}</p>
      <p>
        - {props.user} - {formatTime(props.createdAt.seconds + "000")}
      </p>
      {props.onLike && props.likeStatus ? (
        <button onClick={() => props.onLike()}>Unlike</button>
      ) : props.onLike ? (
        <button onClick={() => props.onLike()}>Like</button>
      ) : null}
      <p>Likes: {props.likes ? props.likes.length : 0}</p>
      {coms.length > 0 ?
        coms.map((c) => (
          <Comment text={c.text} poster={c.author} time={formatTime(c.createdAt.seconds + '000')} />
          ))
        : null}
        <button className='add-comment-button' onClick={() => addComment()}>
          Add Comment
        </button>
    </div>
  );
};

export default Post;
