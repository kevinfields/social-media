import React from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const SignIn = (props) => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    props.auth.signInWithPopup(provider);
  };
  return (
    <div id="login-screen">
      <h2 id="login-message">Tweet Book</h2>
      <button id="login-button" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;
