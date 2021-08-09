import React from 'react';
import './App.css';
import Navigator from './Component/Navigator';
import ReservationForm from './Component/ReservationForm';
import Login from './Component/Login';
import Mypage from './Component/Mypage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {

  return (
    <div className="m-5">
      <Navigator />
      <Router>
        <div>
          <Switch>
            <Route path="/mypage">
              <div className="ddd">
                <Mypage />
              </div>
            </Route>
            <Route path="/reservation">
              <div className="ddd">
                <ReservationForm />
              </div>
            </Route>
            <Route path="/">
              <div>
                <Login />
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
