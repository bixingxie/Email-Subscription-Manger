import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import { HomePage } from "./Components/HomePage";
import { NavLink as RRNavLink } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Nav tabs>
            <NavItem>
              <NavLink tag={RRNavLink} exact to="/" activeClassName="active">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag={RRNavLink}
                exact
                to="/about"
                activeClassName="active"
              >
                About
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag={RRNavLink}
                exact
                to="/users"
                activeClassName="active"
              >
                Users
              </NavLink>
            </NavItem>
          </Nav>

          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

const Home = () => {
  return (
    <div>
      <HomePage />
    </div>
  );
};

const About = () => {
  return <h2>About</h2>;
};

const Users = () => {
  return <h2>Users</h2>;
};

export default App;
