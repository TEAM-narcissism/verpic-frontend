import logo from './logo.svg';
import './App.css';
import Navigator from './Component/Navigator';
import Card from './Component/Card';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
function App() {
  return (
    
   <div className="m-5">

        <Navigator />
        <Card />
     
    </div>

  );
}

export default App;
