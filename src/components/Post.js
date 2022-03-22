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
        console.log('comments: ' + JSON.stringify(comments))
      })
    });
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
    </div>
  );
};

export default Post;
