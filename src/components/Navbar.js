import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import UserProfile from "../pages/UserProfile";
import SignIn from "../pages/SignIn";
import SignOut from "../pages/SignOut";
import CreatePost from "../pages/CreatePost";
import AllUsers from "../pages/AllUsers";

const Navbar = (props) => {
  return (
    <div className="user-home-nav">
      <section className="nav-links">
        <p>
          <Link className="nav-link" to="/sign-out">
            Sign Out
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
          <Link className='nav-link' to='/all-users'>
            All Users
          </Link>
        </p>
      </section>
      <section>
        <Routes>
          <Route path="/sign-out" element={<SignOut auth={props.auth} />} />
          <Route
            path="/user-profile"
            element={
              <UserProfile user={props.user} firestore={props.firestore} />
            }
          />
          <Route
            path="/create-post"
            element={
              <CreatePost user={props.user} firestore={props.firestore} />
            }
          />
          <Route path='/all-users' element={<AllUsers user={props.user} firestore={props.firestore} />} />
        </Routes>
      </section>
    </div>
  );
};

export default Navbar;
