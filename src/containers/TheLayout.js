import React from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'
import Login from "../views/pages/login/Login";
import {setIsLoggedIn, setToken, setUser} from "../redux/actions/AuthActions";
import {useSelector} from "react-redux";

const TheLayout = () => {

  const auth = useSelector(state => state.AuthReducer);
  const session = JSON.parse(localStorage.getItem('session_exchange'));
  if (!auth.token && (!session || !('token' in session) || !session.token)) {
    return <Login/>;
  }

  if (!auth.token) {
    setToken(session.token);
    setIsLoggedIn(session.isLoggedIn);
    setUser(session.user);
  }

  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
