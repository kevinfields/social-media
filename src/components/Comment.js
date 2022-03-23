import React, { useState } from "react";
import formatTime from "../functions/formatTime";

const Comment = (props) => {
  const [removed, setRemoved] = useState(false);

  if (props.comment.data.removed && !removed) {
    setRemoved(true);
  }
  const onDelete = async (comment) => {
    console.log("comment: " + JSON.stringify(comment));
    let data;
    await props.cRef
      .doc(comment)
      .get()
      .then((doc) => {
        data = doc.data();
      });

    await props.cRef.doc(comment).set({
      ...data,
      text: "comment removed",
      likes: [],
      dislikes: [],
      removed: true,
    });
    setRemoved(true);
  };
  return (
    <section className="comment">
      <p className="comment-text">
        {!removed ? props.comment.data.text : "comment removed"}
      </p>
      <p className="comment-poster"> - {props.comment.data.author}</p>
      { !removed ?
        <p className="comment-time">
        {formatTime(props.comment.data.createdAt.seconds + "000")}
      </p>
      : null}
      {props.comment.data.uid === props.browser.uid && !removed ? (
        <button
          className="comment-delete-button"
          onClick={() => onDelete(props.comment.id)}
        >
          Delete
        </button>
      ) : null}
    </section>
  );
};

export default Comment;
