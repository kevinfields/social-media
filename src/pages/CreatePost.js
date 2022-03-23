import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = (props) => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const postsRef = props.firestore
    .collection("users")
    .doc(props.user.uid)
    .collection("posts");

  const makePost = async () => {
    await postsRef
      .add({
        text: text,
        createdAt: new Date(),
        uid: props.user.uid,
        author: props.user.displayName,
        likes: [],
        dislikes: [],
        comments: [],
      })
      .then(() => {
        setText("");
        navigate("/user-profile");
      });
  };

  return (
    <div className="create-post-page">
      <button id="create-post-button" onClick={() => makePost()}>
        Post
      </button>
      <textarea
        id="create-post-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
      />
    </div>
  );
};

export default CreatePost;
