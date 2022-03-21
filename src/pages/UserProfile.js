import React, { useState, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import formatTime from "../functions/formatTime";
import Post from "../components/Post";

const UserProfile = (props) => {
  const [userData, setUserData] = useState({});
  //const postsRef = props.firestore
  //  .collection("users")
  //  .doc(props.user.uid)
  //  .collection("posts");
  const userRef = props.firestore.collection("users").doc(props.user.uid);
  const postsRef = userRef.collection("posts");
  const query = postsRef.orderBy("createdAt", "desc");
  const [posts] = useCollectionData(query, { idField: "id" });

  const getProfileData = async () => {
    let data;
    await userRef.get().then((doc) => {
      data = doc.data();
    });
    setUserData(data);
    if (data === undefined || data === null) {
      await userRef.set({
        id: props.user.uid,
        accountBirthday: new Date(),
        name: props.user.displayName,
        photoURL: props.user.photoURL,
        postCount: 0,
        commentCount: 0,
        bio: "",
        friends: [],
        likedPosts: [],
        dislikedPosts: [],
        likedComments: [],
        dislikedComments: [],
        requests: [],
      });
    }
    console.log(JSON.stringify(data));
  };

  useEffect(() => {
    getProfileData();
    // eslint-disable-next-line
  }, []);
  //  useEffect(() => {
  //    getPosts();
  //  }, []);

  //  const getPosts = async () => {
  //    let data;
  //    await postsRef.get().then((doc) => {
  //      data = doc.data();
  //      setUserPosts({
  //          ...userPosts,

  //      })
  //    });
  //  };

  return (
    <div className="user-profile">
      <p id="user-profile-name-header">{props.user.displayName}</p>
      <img
        id="user-profile-image"
        src={props.user.photoURL}
        alt={props.user.displayName}
      />
      <p id="user-profile-email" className="user-profile-details">
        Email: {props.user.email}
      </p>
      <p id="user-profile-id-header" className="user-profile-details">
        User ID: {props.user.uid}
      </p>
      <p id="user-profile-last-sign-in" className="user-profile-details">
        Last Sign In: {formatTime(props.user.metadata.b)}
      </p>
      <p id="user-profile-account-created" className="user-profile-details">
        Account Created: {formatTime(props.user.metadata.a)}
      </p>
      {userData ? (
        <p id="user-profile-biography" className="user-profile-details">
          Biography: {userData.bio}
        </p>
      ) : null}
      <section id="user-profile-user-posts">
        {posts &&
          posts.map((post) => (
            <Post
              user={props.user.displayName}
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

export default UserProfile;
