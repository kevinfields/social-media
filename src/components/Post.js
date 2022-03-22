import React from "react";
import formatTime from "../functions/formatTime";

const Post = (props) => {
  return (
    <div className="post">
      <p>{props.text}</p>
      <p>
        - {props.user} - {formatTime(props.createdAt.seconds + "000")}
      </p>
      {props.onLike ? (
        <button onClick={() => props.onLike()}>Like</button>
      ) : null}
    </div>
  );
};

export default Post;
