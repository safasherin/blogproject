import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar/Navbar.js';
import Single from './pages/Single/Single.js';
// import Write from './pages/Write/Write.js';
import Home from './pages/Home/Home.js';
import Login from './pages/Login/Login.js';
import Register from './pages/Register/Register.js';
import Texteditor from './pages/Texteditor/Texteditor.js';
import { Context } from './context/Context.js';
import Settings from './pages/Settings/Settings.js'
import './App.css';
// import Write from './pages/Write/Write.js';
function App() {
  const { user } = useContext(Context);
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/"><Home /></Route>
        <Route path="/register">{user ? <Home /> : <Register />}</Route>
        <Route path="/login">{user ? <Home /> : <Login />}</Route>
        <Route path="/texteditor">{user ? <Texteditor /> : <Home />}</Route>
        {/* <Route path="/write">{user ? <Write /> : <Home />}</Route> */}
        <Route path="/post/:postid"><Single /></Route>
        <Route path="/settings">{user ? <Settings /> : <Register />}</Route>
      </Switch>
    </Router>
  );
}

export default App;
