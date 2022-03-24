import React from "react";

const UserTab = (props) => {
  return (
    <div className="user-tab">
      <p className="user-tab-id">{props.user.id}</p>
      <p className="user-tab-name">{props.user.name}</p>
      <div className="user-tab-image-wrapper">
        <img
          className="user-tab-image"
          src={props.user.photoURL}
          alt={props.user.name}
        />
      </div>
      {props.viewer !== props.user.id ? (
        <>
          {!props.friends && props.addUser ? (
            <button
              className="user-tab-add-friend-button"
              onClick={() => props.addUser(props.user.id, true)}
            >
              Add Friend
            </button>
          ) : (
            <button
              className="user-tab-remove-friend-button"
              onClick={() => props.addUser(props.user.id, false)}
            >
              Remove Friend
            </button>
          )}
        </>
      ) : null}
    </div>
  );
};

export default UserTab;
