import React, { useState, useRef } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import UserProfile from "./pages/UserProfile";
import Navbar from "./components/Navbar";

firebase.initializeApp({
  apiKey: "AIzaSyBLWvAtzT4PCBbs_PqIBwOxopcyv564HL8",
  authDomain: "social-media-3fa91.firebaseapp.com",
  projectId: "social-media-3fa91",
  storageBucket: "social-media-3fa91.appspot.com",
  messagingSenderId: "547758720804",
  appId: "1:547758720804:web:c64335ecd016ad5602d5b1",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <h2 id="main-app-header">Tweet Book</h2>
      <section>
        {user ? (
          <Navbar user={user} auth={auth} firestore={firestore} />
        ) : (
          <SignIn auth={auth} />
        )}
      </section>
    </div>
  );
}

export default App;
