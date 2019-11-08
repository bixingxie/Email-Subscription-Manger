import React from "react";
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import {
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Table,
  Nav,
  NavItem,
  NavLink,
  Spinner
} from "reactstrap";
import { NavLink as RRNavLink } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

// Given by Google API
const CLIENT_ID =
  "602826117073-lt0upfo5khvk59dqf0u50ruor73rrg6n.apps.googleusercontent.com";

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
  const login = <Login />;
  return <div>{login}</div>;
};

const About = () => {
  return <h2>About</h2>;
};

const Users = () => {
  return <h2>Users</h2>;
};

class SubscriptionManager extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      loaded: false
    };
  }

  componentDidMount() {
    fetch("http://localhost:4000/manage_subscription/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => this.setState({ data: data, loaded: true }));
  }

  render() {
    return (
      <div>
        {this.state.loaded ? (
          <Table dark>
            <thead>
              <tr>
                <th>#</th>
                <th>Vendor Name</th>
                <th>Link to Unsubscribe</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.data).map((key, index) => {
                return (
                  <tr>
                    <th scope="row">{index}</th>
                    <td>{key}</td>
                    <td>{this.state.data[key]}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <Spinner color="dark" />
        )}
      </div>
    );
  }
}

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      userEmail: null,
      userName: null,
      tokenObj: null,
      token: "",
      subscriptions: {}
    };
  }

  // Handles login
  login = response => {
    this.setState(
      {
        isAuthenticated: true,
        token: response.tokenId,
        userEmail: response.profileObj.email,
        userName: response.profileObj.name,
        tokenObj: JSON.stringify(response.tokenObj)
      },
      () => {
        this.sendUserToken();
      }
    );
  };

  // Send user token to backend
  sendUserToken = () => {
    fetch("http://localhost:4000/get_token/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: this.state.tokenObj
    });
  };

  // Handles logout
  logout = () => {
    this.setState({ isAuthenticated: false, token: "", user: null });
  };

  // Handles log in failure
  onFailure = error => {
    alert(error);
  };

  render() {
    let logInOrOutButton;

    if (this.state.isAuthenticated) {
      logInOrOutButton = (
        <GoogleLogout
          clientId={CLIENT_ID}
          buttonText="Logout"
          onLogoutSuccess={this.logout}
        />
      );
    } else {
      logInOrOutButton = (
        <GoogleLogin
          clientId={CLIENT_ID}
          scope="https://mail.google.com/"
          buttonText="Login with Google"
          onSuccess={this.login}
          onFailure={this.onFailure}
          cookiePolicy={"single_host_origin"}
        />
      );
    }

    return (
      <div>
        <Card>
          <CardBody>
            <CardTitle>Email Subscription Manager</CardTitle>

            <CardSubtitle>
              {" "}
              Welcome,{" "}
              {this.state.isAuthenticated
                ? this.state.userName
                : "Please log in"}{" "}
            </CardSubtitle>

            {this.state.isAuthenticated ? <SubscriptionManager /> : <hr />}

            {logInOrOutButton}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default App;
