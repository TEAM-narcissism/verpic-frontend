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
    <div className="m-5">
      <Preview />
    </div>
  );
}

export default App;
