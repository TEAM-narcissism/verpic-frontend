import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Navigator from './Component/Navigator';
import CardList from './Component/CardList';
import StudyChat from './VideoChat/StudyChat';
import VideoPlayer from './VideoChat/VideoPlayer'

import ReservationForm from './Component/ReservationForm';
import { Route } from 'react-router-dom';
function App() {

    function generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    if (localStorage.getItem("uuid") === null) {
        localStorage.setItem("uuid", generateUuid());
    }

    console.log("local.uuid:" + localStorage.getItem("uuid"));


  return (
    <div>
      <Navigator />
      
      <Route path="/" exact={true}>
        <div className="ddd">
          <CardList />
          <ReservationForm/>
        </div>
      </Route>


      <Route path="/videochat" exact={true}>
        <StudyChat uuid={localStorage.getItem("uuid")}/>
      </Route>

      <Route path="/webrtc" >
        <VideoPlayer></VideoPlayer>
      </Route>
    </div>
  );
}

export default App;
