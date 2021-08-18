
import "./App.css";

import StudyChat from './VideoChat/StudyChat';
import Login from './Auth/Login';

import { Route } from 'react-router-dom';
import PrivateRoute from './Route/PrivateRoute';
import PublicRoute from './Route/PublicRoute';
import MainPage from './Home/MainPage';
import Logout from './Auth/Logout';
import Signup from './Auth/Signup';

import { Stomp } from '@stomp/stompjs';
import * as SockJS from "sockjs-client";
import UserCardList from './Component/UserCardList';
import React, { createContext, useContext, useEffect, useState } from "react";

import MatchingPost from "./Api/MatchingPost";
import Mypage from "./User/Mypage";

export const conn = new SockJS("http://localhost:8080/ws-stomp");
export const stompconn = Stomp.over(conn);




function App() {
  return (
    <div>
      {/* 로그인을 해야 접근 가능한 영역 */}


      <PrivateRoute component={Logout} path="/logout" exact />
      <PrivateRoute component={StudyChat} path="/studychat/:localRoom" />
      <PrivateRoute component={UserCardList} path="/topic/reservation" exact />
      <PrivateRoute component={MatchingPost} path="/matching" exact />
      <PrivateRoute component={Mypage} path="/profile/:id" />
      <PrivateRoute component={MainPage} path="/" exact />


      {/* 로그인 / 로그아웃에 관계 없이 접근 가능한 영역 */}
      {/* <Route component={MainPage} path="/" exact /> */}


      {/* 로그인을 안해야 접근 가능한 영역 */}
      <PublicRoute component={Login} path="/login" exact />
      <PublicRoute component={Signup} path="/signup" exact />
    </div>
  );
}

export default App;
