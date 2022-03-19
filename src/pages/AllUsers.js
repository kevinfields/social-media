import React, { useState, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import UserTab from "../components/UserTab";
import OtherUser from "./OtherUser";
import { Route, Routes } from "react-router-dom";

const AllUsers = (props) => {
  const usersRef = props.firestore.collection("users");
  const query = usersRef.orderBy("bio", "desc");
  const [users] = useCollectionData(query, { idField: "id" });
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
  }, [friends]);

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
    let requestList = [...friendData.requests];

    if (actually) {
      friendsList.push(id);
      requestList.push(props.user.uid);
    } else {
      friendsList = friendsList.filter((friend) => friend !== id);
      requestList = requestList.filter((request) => request !== props.user.uid);
    }
    console.table(friendsList);

    await usersRef.doc(props.user.uid).set({
      ...data,
      friends: friendsList,
    });
  };

  return (
    <div className="all-users-page">
      {users &&
        users.map((user) => (
          <>
            <UserTab
              user={user}
              viewer={props.user.uid}
              addUser={(id, actually) => addUser(id, actually)}
              friends={friends.includes(user.id) ? true : false}
            />
            {/*<p className="profile-link">
              <Link to={`/all-users/${user.id}`}>Profile</Link>
            </p>
            <Routes>
              <Route
                path={`/all-users/${user.id}`}
                element={<OtherUser user={user} firestore={props.firestore} />}
              />
            </Routes>*/}
          </>
        ))}
    </div>
  );
};

export default AllUsers;
