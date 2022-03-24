import React, { useState, useEffect } from "react";
import Post from "../components/Post";

const MyFeed = (props) => {
  const userRef = props.firestore.collection("users").doc(props.user.uid);
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  let data;
  const getFriends = async () => {
    await userRef
      .get()
      .then((doc) => {
        data = doc.data();
      })
      .then(() => {
        setFriends(data.friends);
      });
  };

  const getPosts = async () => {
    let data = [];
    for (const f of friends) {
      let user;
      await props.firestore
        .collection("users")
        .doc(f)
        .get()
        .then((doc) => (user = doc.data()));
      await props.firestore
        .collection("users")
        .doc(f)
        .collection("posts")
        .orderBy("createdAt", "desc")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            data.push({
              data: doc.data(),
              id: doc.id,
              author: f,
              user: user,
              time: doc.data().createdAt,
            });
          });
        });
    }
    setPosts(data.sort((a, b) => b.time - a.time));
  };

  const likePost = async (user, id, postsRef) => {
    let data;

    await postsRef
      .doc(id)
      .get()
      .then((doc) => (data = doc.data()));

    if (data.likes.includes(props.user.uid)) {
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
    getPosts();
  };

  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    getPosts();
  }, [friends]);

  return (
    <div id="main-feed">
      {posts.map((post) => (
        <section className="feed-post" key={post.id}>
          <Post
            user={post.data.author ? post.data.author : post.data.uid}
            uid={post.data.uid}
            userData={post.user}
            text={post.data.text}
            createdAt={post.data.createdAt}
            postId={post.id}
            key={post.id}
            likes={post.data.likes}
            dislikes={post.data.dislikes}
            browser={props.user}
            likeStatus={post.data.likes.includes(props.user.uid)}
            onLike={() =>
              likePost(
                props.user,
                post.id,
                props.firestore
                  .collection("users")
                  .doc(post.data.uid)
                  .collection("posts")
              )
            }
            userRef={userRef}
            commentRef={props.firestore
              .collection("users")
              .doc(post.data.uid !== undefined ? post.data.uid : "0")
              .collection("posts")
              .doc(post.id)
              .collection("comments")}
            changeOtherUser={(u) => props.changeOtherUser(u)}
          />
        </section>
      ))}
    </div>
  );
};

export default MyFeed;
