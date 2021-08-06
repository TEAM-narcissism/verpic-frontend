import React, { useState, useEffect } from 'react';
import './App.css';
import Navigator from './Component/Navigator';
import CardList from './Component/CardList';
import StudyChat from './VideoChat/StudyChat';
import Login from './Auth/Login';

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


    // 실험용입니다.



  return (
    <div>
      <Navigator />
      
      <Route path="/" exact={true}>
        <div class="container flex">
          <CardList />
          <ReservationForm/>
          <div class="mt-5">
            <button class="p-1 border text-white border-black bg-black rounded" onClick={() => window.open('/videochat', '_blank')}>VideoChat</button>
          </div>
        </div>
      </Route>


      <Route path="/videochat" exact={true}>
        <StudyChat localUserName={localStorage.getItem("uuid")}/>
      </Route>

      <Route path="/login" exact={true}>
        <Login></Login>
      </Route>
  
    </div>
  );
}

export default App;
