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
      await props.firestore
        .collection("users")
        .doc(f)
        .collection("posts")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            data.push({
              data: doc.data(),
              id: doc.id,
              author: f,
            });
          });
        });
    }
    console.log(JSON.stringify(data));
    setPosts(data);
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
          />
        </section>
      ))}
    </div>
  );
};

export default MyFeed;
