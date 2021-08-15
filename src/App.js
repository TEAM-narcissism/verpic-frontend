import "./App.css";

import React, { useEffect, useState } from "react";

import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import MainPage from "./Home/MainPage";
import Preview from "./Component/Preview";
import PrivateRoute from "./Route/PrivateRoute";
import PublicRoute from "./Route/PublicRoute";
import { Route } from "react-router-dom";
import StudyChat from "./VideoChat/StudyChat";
import isAuthorized from "./Auth/isAuthorized";

function App() {
  function generateUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  if (localStorage.getItem("uuid")) {
    localStorage.setItem("uuid", generateUuid());
  }

  return (
    <div>
      {/* <Navigator/> */}

      {/* 로그인을 해야 접근 가능한 영역 */}
      <PrivateRoute component={Logout} path="/logout" exact />
      <PrivateRoute
        component={StudyChat}
        localUserName={localStorage.getItem("uuid")}
        path="/studychat"
        exact
      />

      {/* 로그인을 안해야 접근 가능한 영역 */}
      <PublicRoute component={Login} path="/login" exact />

      {/* 로그인 / 로그아웃에 관계 없이 접근 가능한 영역 */}
      <Route component={MainPage} path="/" exact />
      <Route component={Preview} path="/preview" exact />
      <Route component={StudyChat} path="/chat" exact />
    </div>
  );
}

export default App;
