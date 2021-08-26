import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/register' component={Register}></Route>
        <Route path='/home' component={Home}></Route>
        <Redirect from='/' to='/home' />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
