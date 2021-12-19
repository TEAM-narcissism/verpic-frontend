import "./App.css";

import * as SockJS from "sockjs-client";

import EditUserInfo from "./pages/User/EditUserInfo";
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import MainPage from "./pages/Home/MainPage";
import MatchingPost from "./api/MatchingPost";
import Mypage from "./pages/User/Mypage";
import Preview from "./pages/Preview/Preview";
import PrivateRoute from "./Route/PrivateRoute";
import PublicRoute from "./Route/PublicRoute";
import React from "react";
import ReservationCardList from "./components/ReservationList/ReservationCardList";
import Signup from "./Auth/Signup";
import { Stomp } from "@stomp/stompjs";
import StudyChat from "./pages/VideoChat/StudyChat";
import TestPage from "./pages/Home/TestPage";

import FeedbackPage from "./pages/FeedBack/FeedbackPage"
import FeedbackList from "./pages/FeedBack/FeedbackList"
import VideoCheck from "./pages/VideoChat/VideoCheck";




export const conn = new SockJS("/ws-stomp");

export const stompconn = Stomp.over(conn);




function App() {
  return (
      <>
      {/* 로그인을 해야 접근 가능한 영역 */}

      <PrivateRoute component={Logout} path="/logout" exact />
      <PrivateRoute component={StudyChat} path="/studychat/:localRoom" />
      <PrivateRoute
        component={ReservationCardList}
        path="/topic/reservation"
        exact
      />
      <PrivateRoute component={MatchingPost} path="/matching" exact />
      <PrivateRoute component={Mypage} path="/profile/:id" />
      <PrivateRoute component={MainPage} path="/" exact />
      <PrivateRoute component={TestPage} path="/test" exact />
      <PrivateRoute component={Preview} path="/preview/:previewId" />
      <PrivateRoute component={FeedbackPage} path="/feedback/:matchId" />
      <PrivateRoute component={FeedbackList} path="/feedback" exact />
      <PrivateRoute component={EditUserInfo} path="/edit/:userId" />
      <PrivateRoute component={VideoCheck} path="/videochecking/:matchId" />

      {/* 로그인 / 로그아웃에 관계 없이 접근 가능한 영역 */}
      {/* <Route component={MainPage} path="/" exact /> */}

      {/* 로그인을 안해야 접근 가능한 영역 */}
      <PublicRoute component={Login} path="/login" exact />
      <PublicRoute component={Signup} path="/signup" exact />
    </>
  );
}

export default App;
