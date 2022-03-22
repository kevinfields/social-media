import React from "react";
import formatTime from "../functions/formatTime";

const Post = (props) => {
  console.log(JSON.stringify(props));
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
      <p>Dislikes: {props.dislikes ? props.dislikes.length : 0}</p>
    </div>
  );
};

export default Post;
