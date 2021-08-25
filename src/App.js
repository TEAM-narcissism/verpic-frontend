import "./App.css";

import * as SockJS from "sockjs-client";

import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import MainPage from "./Home/MainPage";
import MatchingPost from "./Api/MatchingPost";
import Mypage from "./User/Mypage";
import Preview from "./Preview/Preview";
import EditUserInfo from "./User/EditUserInfo";
import PrivateRoute from "./Route/PrivateRoute";
import PublicRoute from "./Route/PublicRoute";
import React from "react";
import Signup from "./Auth/Signup";
import { Stomp } from "@stomp/stompjs";
import StudyChat from "./VideoChat/StudyChat";
import TestPage from "./Home/TestPage";
import ReservationCardList from "./ReservationList/ReservationCardList";
import FeedbackPage from "./Feedback/FeedbackPage"

export const conn = new SockJS("http://localhost:8080/ws-stomp");
export const stompconn = Stomp.over(conn);

function App() {
  return (
    <div>
      {/* 로그인을 해야 접근 가능한 영역 */}

      <PrivateRoute component={Logout} path="/logout" exact />
      <PrivateRoute component={StudyChat} path="/studychat/:localRoom" />
      <PrivateRoute component={ReservationCardList} path="/topic/reservation" exact />
      <PrivateRoute component={MatchingPost} path="/matching" exact />
      <PrivateRoute component={Mypage} path="/profile/:id" />
      <PrivateRoute component={MainPage} path="/" exact />
      <PrivateRoute component={TestPage} path="/test" exact />
      <PrivateRoute component={Preview} path="/preview/:previewId" exact />
      <PrivateRoute component={FeedbackPage} path="/feedback/:matchId" excat/>
      <PrivateRoute component={EditUserInfo} path="/edit/:userId" exact />

      {/* 로그인 / 로그아웃에 관계 없이 접근 가능한 영역 */}
      {/* <Route component={MainPage} path="/" exact /> */}

      {/* 로그인을 안해야 접근 가능한 영역 */}
      <PublicRoute component={Login} path="/login" exact />
      <PublicRoute component={Signup} path="/signup" exact />
    </div>
  );
}

export default App;
