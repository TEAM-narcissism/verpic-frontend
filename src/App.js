import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Navigator from './Component/Navigator';
import CardList from './Component/CardList';
import ReservationForm from './Component/ReservationForm';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
function App() {

  return (
    <div className="m-5">
      <Navigator />
      <div className="ddd">
        <CardList />
        <ReservationForm />
      </div>
    </div>
  );
}

export default App;
