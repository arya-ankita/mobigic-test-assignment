
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import FileUploads from "./components/FileUploads";
import './style.css';
function App() {
  return (
    <>
      <Router>
        <Switch>
         <Route exact path="/">
          <Signup/>
          </Route>
          <Route exact path="/login"><Login /></Route>
          
          <Route exact path="/files"><FileUploads/></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
