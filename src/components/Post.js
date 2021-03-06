import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import formatTime from "../functions/formatTime";
import Comment from "./Comment";

const Post = (props) => {
  const [current, setCurrent] = useState("");
  const [open, setOpen] = useState(false);

  const [coms, setComs] = useState([]);
  let comments = [];

  const getComments = async () => {
    if (props.commentRef) {
      await props.commentRef
        .orderBy("createdAt", "asc")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            comments.push({
              data: doc.data(),
              id: doc.id,
            });
          });
        });
    }
  };

  const addComment = async (text) => {
    if (text === "" || text === undefined || text === null) {
      alert("Comments cannot be blank");
      return;
    }
    await props.commentRef
      .add({
        author: props.browser.displayName,
        uid: props.browser.uid,
        createdAt: new Date(),
        likes: [],
        dislikes: [],
        text: text,
        removed: false,
      })
      .then(() => {
        getComments().then(() => {
          setComs(comments);
        });
        setCurrent("");
        setOpen(false);
      });
  };

  const cancelComment = () => {
    setCurrent("");
    setOpen(false);
  };

  const refresh = () => {
    getComments().then(() => {
      setComs(comments);
    });
  };
  useEffect(() => {
    getComments().then(() => {
      setComs(comments);
    });
  }, []);

  const ProfileLink = () => {
    if (!props.userData) {
      return <p>{props.user}</p>;
    } else {
      return (
        <p onClick={() => props.changeOtherUser(props.userData)}>
          <Link to={`/all-users/${props.uid}`}>{props.user}</Link>
        </p>
      );
    }
  };

  return (
    <div className="post">
      <h2>{props.text}</h2>
      <h3>
        <ProfileLink /> - {formatTime(props.createdAt.seconds + "000")}
      </h3>
      {/*<img
        className="post-profile-picture"
        src={props.userData ? props.userData.photoURL : null}
        alt="none"
      />*/}
      {props.onLike && props.likeStatus ? (
        <button onClick={() => props.onLike()}>Unlike</button>
      ) : props.onLike ? (
        <button onClick={() => props.onLike()}>Like</button>
      ) : null}
      <p>Likes: {props.likes ? props.likes.length : 0}</p>
      {coms.length > 0
        ? coms.map((c) => (
            <Comment
              comment={c}
              browser={props.browser}
              post={props.postId}
              cRef={props.commentRef}
              key={props.postId + coms.indexOf(c)}
              refresh={() => refresh()}
            />
          ))
        : null}
      {!open ? (
        <button onClick={() => setOpen(true)}>Add Comment</button>
      ) : null}
      {open ? (
        <section className="add-comment-screen">
          <textarea
            className="add-comment-text"
            placeholder="write a comment"
            rows={3}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <button
            className="add-comment-button"
            onClick={() => addComment(current)}
          >
            Post
          </button>
          <button className="stop-add-comment" onClick={() => cancelComment()}>
            Cancel
          </button>
        </section>
      ) : null}
    </div>
  );
};

export default Post;
