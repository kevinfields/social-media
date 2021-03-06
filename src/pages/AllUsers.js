import React, { useState, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import UserTab from "../components/UserTab";

const AllUsers = (props) => {
  const usersRef = props.firestore.collection("users");
  const query = usersRef.orderBy("accountBirthday", "desc");
  const [users] = useCollectionData(query, { idField: "id" });
  const [choices, setChoices] = useState([]);
  const [friends, setFriends] = useState([]);

  const getFriends = async () => {
    let data;
    await usersRef
      .doc(props.user.uid)
      .get()
      .then((doc) => {
        data = doc.data();
      });
    setFriends([...data.friends]);
  };

  useEffect(() => {
    getFriends();
    // eslint-disable-next-line
  }, []);

  const addUser = async (id, actually) => {
    let data;
    let friendData;

    await usersRef
      .doc(props.user.uid)
      .get()
      .then((doc) => {
        data = doc.data();
      });

    await usersRef
      .doc(id)
      .get()
      .then((doc) => {
        friendData = doc.data();
      });

    let friendsList = [...data.friends];
    let followersList = [...friendData.followers];

    if (actually) {
      friendsList.push(id);
      followersList.push(props.user.uid);
    } else {
      friendsList = friendsList.filter((friend) => friend !== id);
      followersList = followersList.filter(
        (follow) => follow !== props.user.uid
      );
    }

    await usersRef.doc(props.user.uid).set({
      ...data,
      friends: friendsList,
    });
    await usersRef.doc(id).set({
      ...friendData,
      followers: followersList,
    });
    getFriends();
  };
  return (
    <div className="all-users-page">
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <UserTab
              user={user}
              viewer={props.user.uid}
              addUser={(id, actually) => addUser(id, actually)}
              friends={friends.includes(user.id) ? true : false}
            />
            {user.id !== props.user.uid ? (
              <p className="profile-link" onClick={() => props.onSelect(user)}>
                <Link to={`/all-users/${user.id}`}>View Profile</Link>
              </p>
            ) : (
              <p className="profile-link" onClick={() => props.onSelect(user)}>
                <Link to={`/user-profile`}>View Profile</Link>
              </p>
            )}
          </div>
        ))}
    </div>
  );
};

export default AllUsers;
