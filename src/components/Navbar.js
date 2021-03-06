import React, { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import UserProfile from "../pages/UserProfile";
import SignOut from "../pages/SignOut";
import CreatePost from "../pages/CreatePost";
import AllUsers from "../pages/AllUsers";
import MyFeed from "../pages/MyFeed";
import OtherUser from "../pages/OtherUser";
import SortUsers from "../pages/SortUsers";

const Navbar = (props) => {
  const [user, setUser] = useState("");

  const changeOtherUser = (u) => {
    console.log("user: " + JSON.stringify(u));
    setUser(u);
  };

  return (
    <div className="user-home-nav">
      <section className="nav-links">
        <p>
          <Link className="nav-link" to="/my-feed">
            My Feed
          </Link>
        </p>
        <p>
          <Link className="nav-link" to="/user-profile">
            Profile
          </Link>
        </p>
        <p>
          <Link className="nav-link" to="/create-post">
            New Post
          </Link>
        </p>
        <p>
          <Link className="nav-link" to="/all-users">
            All Users
          </Link>
        </p>
        <p>
          <Link className="nav-link" to="/sign-out">
            Sign Out
          </Link>
        </p>
        <p>
          <Link className="nav-link" to="/search-users">
            Search Users
          </Link>
        </p>
      </section>
      <section>
        <Routes>
          <Route path="/sign-out" element={<SignOut auth={props.auth} />} />
          <Route
            path="/my-feed"
            element={
              <MyFeed
                user={props.user}
                firestore={props.firestore}
                changeOtherUser={(u) => changeOtherUser(u)}
              />
            }
          />
          <Route
            path="/user-profile"
            element={
              <UserProfile
                user={props.user}
                firestore={props.firestore}
                changeOtherUser={(u) => changeOtherUser(u)}
              />
            }
          />
          <Route
            path="/create-post"
            element={
              <CreatePost user={props.user} firestore={props.firestore} />
            }
          />
          <Route
            exact
            path="/all-users"
            element={
              <AllUsers
                user={props.user}
                firestore={props.firestore}
                onSelect={(u) => changeOtherUser(u)}
              />
            }
          />
          <Route
            path={`/all-users/${user.id}`}
            element={
              <OtherUser
                firestore={props.firestore}
                user={user}
                browser={props.user}
              />
            }
          />
          <Route
            path={`/search-users`}
            element={
              <SortUsers
                firestore={props.firestore}
                changeOtherUser={(u) => changeOtherUser(u)}
              />
            }
          />
        </Routes>
      </section>
    </div>
  );
};

export default Navbar;
