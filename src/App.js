import React, { useState, useEffect } from 'react';
import './App.css';

import StudyChat from './VideoChat/StudyChat';
import Login from './Auth/Login';

import { Route } from 'react-router-dom';
import PrivateRoute from './Route/PrivateRoute';
import PublicRoute from './Route/PublicRoute';
import MainPage from './Home/MainPage';
import Logout from './Auth/Logout';

import { Stomp } from '@stomp/stompjs';
import * as SockJS from "sockjs-client";
import UserCardList from './Component/UserCardList';


export const conn = new SockJS('http://localhost:8080/ws-stomp');
export const stompconn = Stomp.over(conn);

function App() {

  return (
    <div>
      {/* <Navigator/> */}


      {/* 로그인을 해야 접근 가능한 영역 */}
      <PrivateRoute component={Logout} path="/logout" exact />
      <PrivateRoute component={StudyChat} path="/studychat" exact />
      <PrivateRoute component={UserCardList} path="/topic/reservation" exact />


      {/* 로그인을 안해야 접근 가능한 영역 */}
      <PublicRoute component={Login} path="/login" exact />

      {/* 로그인 / 로그아웃에 관계 없이 접근 가능한 영역 */}
      <Route component={MainPage} path="/" exact />

    </div>
  );
}

export default App;
