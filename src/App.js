import "./App.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Card from "./Component/Card";
import Navigator from "./Component/Navigator";
import Preview from "./Component/Preview";
import logo from "./logo.svg";

function App() {
  return (
    <div className="m-5">
      <Navigator />
      <Preview />
    </div>
  );
}

export default App;
