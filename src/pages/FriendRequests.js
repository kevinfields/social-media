import React, { useState } from "react";

const FriendRequests = (props) => {
  const [requests, setRequests] = useState([]);
  const userRef = props.firestore.collection("users");

  let data;

  const getData = async () => {
    await userRef
      .doc(props.user.uid)
      .get()
      .then((doc) => {
        data = doc.data();
      });
  };

  getData().then(() => {
    console.table(data);
    setRequests([...data.requests]);
  });

  return (
    <div className="friend-requests">
      {requests.map((req) => (
        <div>
          <p>{req}</p>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;
