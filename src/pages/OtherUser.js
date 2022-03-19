import React from "react";
import Post from "../components/Post";
import { useCollectionData } from "react-firebase-hooks/firestore";
import formatTime from "../functions/formatTime";

const OtherUser = (props) => {
  const postsRef = props.firestore
    .collection("users")
    .doc(props.user.id)
    .collection("posts");
  const query = postsRef.orderBy("createdAt", "desc");
  const [posts] = useCollectionData(query, { idField: "id" });

  return (
    <div className="o-u-profile">
      <p id="user-profile-name-header">{props.user.name}</p>
      <img
        id="user-profile-image"
        src={props.user.photoURL}
        alt={props.user.name}
      />
      <p id="user-profile-email" className="user-profile-details">
        Email: {props.user.email}
      </p>
      <p id="user-profile-id-header" className="user-profile-details">
        User ID: {props.user.id}
      </p>
      <p id="user-profile-account-created" className="user-profile-details">
        Account Created: {formatTime(props.user.accountBirthday)}
      </p>
      <section id="user-profile-user-posts">
        {posts &&
          posts.map((post) => (
            <Post
              user={props.user.name}
              text={post.text}
              createdAt={post.createdAt}
              postId={post.id}
              key={post.id}
              comments={post.comments}
              likes={post.likes}
              dislikes={post.dislikes}
            />
          ))}
      </section>
    </div>
  );
};

export default OtherUser;