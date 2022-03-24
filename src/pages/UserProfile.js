import React, { useState, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import formatTime from "../functions/formatTime";
import goodPhotoURL from "../functions/goodPhotoURL";
import Post from "../components/Post";
import UserTab from "../components/UserTab";
import { Link } from "react-router-dom";

const UserProfile = (props) => {
  const [userData, setUserData] = useState({});
  const [edit, setEdit] = useState({
    bio: "",
    edit: "",
  });
  const [count, setCount] = useState(0);
  const [openEditor, setOpenEditor] = useState(false);
  const [friends, setFriends] = useState([]);
  const [openFriends, setOpenFriends] = useState(false);
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
    setCount(data.friends.length);
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
  };

  const openFriendsList = async (bool) => {
    if (!bool) {
      setOpenFriends(false);
      return;
    }
    let data;
    let list = [];
    await userRef.get().then((doc) => (data = doc.data()));
    for (const f of data.friends) {
      await props.firestore
        .collection("users")
        .doc(f)
        .get()
        .then((doc) => {
          list.push({
            id: f,
            data: doc.data(),
          });
        });
    }
    setFriends(list);
    setOpenFriends(true);
  };

  const editUserData = async () => {
    let data;
    if (edit.edit === "" || edit.edit === null || edit.edit === undefined) {
      return;
    }

    await userRef.get().then((doc) => (data = doc.data()));

    if (edit.bio === "false") {
      if (goodPhotoURL(edit.edit)) {
        await userRef.set({
          ...data,
          photoURL: edit.edit,
        });
      } else {
        alert("Please enter a URL ending with a .jpg, .png, or .jpeg");
      }
    } else {
      await userRef.set({
        ...data,
        bio: edit.edit,
      });
    }
    setEdit({
      ...edit,
      edit: "",
    });
    getProfileData();
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
      <p id="user-profile-name-header">
        {userData ? userData.name : props.user.displayName}
      </p>
      <img
        id="user-profile-image"
        src={userData ? userData.photoURL : props.user.photoURL}
        alt={userData ? userData.name : props.user.displayName}
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
        <>
          {!openEditor ? (
            <button
              className="profile-editor-switch"
              onClick={() => setOpenEditor(true)}
            >
              Open Editor
            </button>
          ) : (
            <button
              className="profile-editor-switch"
              onClick={() => setOpenEditor(false)}
            >
              Close Editor
            </button>
          )}
          <p id="user-profile-biography" className="user-profile-details">
            Biography: {userData.bio}
          </p>
          <p id="user-profile-friend-list" className="user-profile-details">
            Friends: {count}
            {!openFriends ? (
              <button
                onClick={() => openFriendsList(true)}
                id="user-profile-friend-list-button"
              >
                View List
              </button>
            ) : (
              <button
                onClick={() => openFriendsList(false)}
                id="user-profile-post-list-button"
              >
                View Posts
              </button>
            )}
          </p>
        </>
      ) : null}
      {openEditor ? (
        <section id="profile-editor">
          <button
            id="user-profile-edit-profile"
            className="user-profile-details"
            onClick={() => editUserData()}
          >
            Edit Profile
          </button>
          <select
            id="user-profile-bio-edit-select"
            value={edit.bio}
            onChange={(e) =>
              setEdit({
                ...edit,
                bio: e.target.value,
              })
            }
          >
            <option value="" disabled selected>
              Choose Detail
            </option>
            <option value="true">Bio</option>
            <option value="false">Profile Picture</option>
          </select>
          {edit.bio === "true" ? (
            <textarea
              value={edit.edit}
              id="user-profile-bio-editor"
              maxLength="100"
              onChange={(e) =>
                setEdit({
                  ...edit,
                  edit: e.target.value,
                })
              }
            />
          ) : edit.bio === "false" ? (
            <input
              type="url"
              placeholder="enter an image link"
              value={edit.edit}
              id="user-profile-photo-editor"
              onChange={(e) =>
                setEdit({
                  ...edit,
                  edit: e.target.value,
                })
              }
            />
          ) : null}
        </section>
      ) : null}
      {!openFriends ? (
        <section id="user-profile-user-posts">
          {posts &&
            posts.map((post) => (
              <Post
                user={props.user.displayName}
                userObj={props.user}
                text={post.text}
                createdAt={post.createdAt}
                postId={post.id}
                key={post.id}
                likes={post.likes}
                dislikes={post.dislikes}
                browser={props.user}
                userRef={userRef}
                commentRef={postsRef.doc(post.id).collection("comments")}
              />
            ))}
        </section>
      ) : (
        <section id="friend-list">
          {friends &&
            friends.map((friend) => (
              <div key={friend.id}>
                <UserTab
                  user={friend.data}
                  viewer={props.user.uid}
                  friends={true}
                />
                <Link
                  className="friend-profile-link"
                  to={`/all-users/${friend.id}`}
                  onClick={() => props.changeOtherUser(friend.data)}
                >
                  Profile
                </Link>
              </div>
            ))}
        </section>
      )}
    </div>
  );
};

export default UserProfile;
