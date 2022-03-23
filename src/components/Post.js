import React, { useState, useEffect} from "react";
import formatTime from "../functions/formatTime";
import Comment from "./Comment";

const Post = (props) => {
  const [current, setCurrent] = useState('');
  const [open, setOpen] = useState(false);

  const [coms, setComs] = useState([]);
  let comments = [];

  const getComments = async () => {
    if (props.commentRef) {
    await props.commentRef.get().then((snap) => {
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
        setCurrent('');
        setOpen(false);
      });
  };

  const cancelComment = () => {
    setCurrent('');
    setOpen(false);
  }

  useEffect(() => {
    getComments().then(() => {
      setComs(comments);
    });
  }, []);

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
      {coms.length > 0
        ? coms.map((c) => (
            <Comment
              comment={c}
              browser={props.browser}
              post={props.postId}
              cRef={props.commentRef}
              key={props.postId + coms.indexOf(c)}
            />
          ))
        : null}
      { !open ? <button onClick={() => setOpen(true)}>Add Comment</button> : null}
      { open ?
      <section className='add-comment-screen'>
        <textarea className='add-comment-text' placeholder='write a comment' rows={3} value={current} onChange={(e) => setCurrent(e.target.value)} />
        <button className="add-comment-button" onClick={() => addComment(current)}>
          Post
        </button>
        <button className='stop-add-comment' onClick={() => cancelComment()}>Cancel</button>
      </section>
      : null}
    </div>
  );
};

export default Post;

