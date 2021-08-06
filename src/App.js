import React, { useState, useEffect } from 'react';
import './App.css';
import Navigator from './Component/Navigator';
import ReservationForm from './Component/ReservationForm';

function App() {

  return (
    <div className="m-5">
      <Navigator />
      <div className="ddd">
        <ReservationForm />
      </div>
    </div>
  );
}

export default App;
