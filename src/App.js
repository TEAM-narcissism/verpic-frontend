import React from 'react';
import './App.css';
import Navigator from './Component/Navigator';
import CardList from './Component/CardList';
import ReservationForm from './Component/ReservationForm';

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
