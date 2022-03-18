import React from "react";

const SignOut = (props) => {
  return (
    props.auth.currentUser && (
      <div className="sign-out-screen">
        <button id="sign-out-button" onClick={() => props.auth.signOut()}>
          Sign Out
        </button>
      </div>
    )
  );
};

export default SignOut;
