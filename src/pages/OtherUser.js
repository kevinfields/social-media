import React from "react";
import Post from "../components/Post";
import { useCollectionData } from "react-firebase-hooks/firestore";
import formatTime from "../functions/formatTime";

const OtherUser = (props) => {
  const postsRef = props.firestore
    .collection("users")
    .doc(props.user.id)
    .collection("posts");
  const userRef = props.firestore
    .collection('users').doc(props.browser.uid);
  const query = postsRef.orderBy("createdAt", "desc");
  const [posts] = useCollectionData(query, { idField: "id" });

  const likePost = async (user, id) => {
    let data;

    await postsRef
      .doc(id)
      .get()
      .then((doc) => (data = doc.data()));

    if (data.likes.includes(props.browser.uid)) {
      await postsRef.doc(id).set({
        ...data,
        likes: data.likes.filter((like) => like !== user.uid),
      });
    } else {
      await postsRef.doc(id).set({
        ...data,
        likes: data.likes.concat(user.uid),
      });
    }
  };

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
      <p id="user-profile-last-sign-in" className="user-profile-details">
        Offline
      </p>
      <p id="user-profile-account-created" className="user-profile-details">
        Account Created: {formatTime(props.user.accountBirthday.seconds * 1000)}
      </p>
      <p id="user-profile-biography" className="user-profile-details">
        Biography: {props.user.bio}
      </p>
      <p id='user-profile-friend-list' className='user-profile-details'>
        Friends: {props.user.friends.length}
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
              likes={post.likes}
              dislikes={post.dislikes}
              browser={props.browser}
              likeStatus={post.likes.includes(props.browser.uid)}
              onLike={() => likePost(props.browser, post.id)}
              userRef={userRef}
              commentRef={postsRef.doc(post.id).collection('comments')}
            />
          ))}
      </section>
    </div>
  );
};

export default OtherUser;
