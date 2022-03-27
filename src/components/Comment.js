import React, { useState } from "react";
import formatTime from "../functions/formatTime";

const Comment = (props) => {
  const [removed, setRemoved] = useState(false);
  const [liked, setLiked] = useState(
    props.comment.data.likes.includes(props.browser.uid)
  );

  if (props.comment.data.removed && !removed) {
    setRemoved(true);
  }

  const likeComment = async () => {
    let data;
    await props.cRef
      .doc(props.comment.id)
      .get()
      .then((doc) => (data = doc.data()));

    if (data.likes.includes(props.browser.uid)) {
      await props.cRef.doc(props.comment.id).set({
        ...data,
        likes: data.likes.filter((id) => id !== props.browser.uid),
      });
      setLiked(false);
      props.refresh();
    } else {
      await props.cRef.doc(props.comment.id).set({
        ...data,
        likes: [...data.likes, props.browser.uid],
      });
      setLiked(true);
      props.refresh();
    }
  };
  const onDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this comment? This cannot be undone."
      )
    ) {
      return;
    }
    let data;
    await props.cRef
      .doc(props.comment.id)
      .get()
      .then((doc) => {
        data = doc.data();
      });

    await props.cRef.doc(props.comment.id).set({
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
      {!removed ? (
        <p className="comment-time">
          {formatTime(props.comment.data.createdAt.seconds + "000")}
        </p>
      ) : null}
      {props.comment.data.uid === props.browser.uid && !removed ? (
        <button className="comment-delete-button" onClick={() => onDelete()}>
          Delete
        </button>
      ) : null}
      {props.comment.data.uid !== props.browser.uid ? (
        <button className="like-comment-button" onClick={() => likeComment()}>
          {liked ? "Unlike" : "Like"}
        </button>
      ) : null}
      <p className="comment-like-count">
        Likes: {props.comment.data.likes.length}
      </p>
    </section>
  );
};

export default Comment;
