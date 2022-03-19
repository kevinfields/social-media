import React, {useState, useEffect } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import UserTab from '../components/UserTab';

const AllUsers = (props) => {

  const usersRef = props.firestore.collection("users");
  const query = usersRef.orderBy("bio", "desc");
  const [users] = useCollectionData(query, { idField: "id" });
  const [friends, setFriends] = useState([]);

  const getFriends = async () => {
    let data;
    await usersRef.doc(props.user.uid).get().then((doc) => {
      data = doc.data();
    })
    setFriends([...data.friends]);

  }

  useEffect(() => {
    getFriends();
  }, [friends])


  const addUser = async (id, actually) => {

    let data;
    await usersRef.doc(props.user.uid).get().then((doc) => {
      data = doc.data();
    })
    let friendsList = [...data.friends];
    if (actually) {
      friendsList.push(id);
    } else {
      friendsList = friendsList.filter(friend => friend !== id);
    }
    console.table(friendsList)

    await usersRef.doc(props.user.uid).set({
      ...data,
      friends: friendsList
    });
     

  }

  return (
    <div className='all-users-page'>
      {users && users.map((user) => (
        <UserTab user={user} 
        viewer={props.user.uid}
        addUser={(id, actually) => addUser(id, actually)}
        friends={friends.includes(user.id) ? true : false}
        />
      ))}
    </div>
  )
}

export default AllUsers