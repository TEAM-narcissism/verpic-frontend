<<<<<<< HEAD
import "./App.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Card from "./Component/Card";
import Navigator from "./Component/Navigator";
import Preview from "./Component/Preview";
import logo from "./logo.svg";
=======
import React, { useState, useEffect } from 'react';
import './App.css';

import StudyChat from './VideoChat/StudyChat';
import Login from './Auth/Login';


import { Route } from 'react-router-dom';
import PrivateRoute from './Route/PrivateRoute';
import isAuthorized from './Auth/isAuthorized';
import PublicRoute from './Route/PublicRoute';
import MainPage from './Home/MainPage';
import Logout from './Auth/Logout';
>>>>>>> 49fa1c1e388a2d32bd7b3e54fd89e6a2ce8f3024

function App() {

    function generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    if (localStorage.getItem("uuid")) {
        localStorage.setItem("uuid", generateUuid());
    }
 


  return (
<<<<<<< HEAD
    <div className="m-5">
      <Navigator />
      <Preview />
=======
    <div>
      {/* <Navigator/> */}




      {/* 로그인을 해야 접근 가능한 영역 */}
      <PrivateRoute component={Logout} path="/logout" exact/>
      <PrivateRoute component={StudyChat} localUserName={localStorage.getItem("uuid")} path="/studychat" exact />


      {/* 로그인을 안해야 접근 가능한 영역 */}
      <PublicRoute component = {Login} path="/login" exact />

      {/* 로그인 / 로그아웃에 관계 없이 접근 가능한 영역 */}
      <Route component = {MainPage} path="/" exact />
      
>>>>>>> 49fa1c1e388a2d32bd7b3e54fd89e6a2ce8f3024
    </div>
  );
}

export default App;
