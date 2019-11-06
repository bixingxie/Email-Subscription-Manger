import React from "react";
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Card from "react-bootstrap/Card";
import { Button } from 'reactstrap';

// Given by Google API
const CLIENT_ID =
  "602826117073-lt0upfo5khvk59dqf0u50ruor73rrg6n.apps.googleusercontent.com";

class App extends React.Component {
  render() {
    var login = <Login />

    return (
      <div>
      {login}
      </div>
    )
  }
}

class SubManager extends React.Component {
  constructor() {
    super()
    this.state = {data: null}
  }
  componentDidMount() {
    var data = fetch('http://localhost:4000/subscriptionManagement/', {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }})
    .then(response => response.json())
    .then(data => this.setState({ data: data }));
  }
  render() {
    console.log(this.state.data)

    return (
      <div>
      </div>
    )
  }
}

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      managerOpen: false,
      isAuthenticated: false,
      userEmail: null,
      userName: null,
      tokenObj: null,
      token: "",
      subscriptions:  {}
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

  showSubscriptions = () => {
    this.setState({managerOpen: !this.state.managerOpen})
  }

  render() {
    let button;
    const cardText = this.state.isAuthenticated
      ? this.state.userName
      : "Please log in";

    if (this.state.isAuthenticated) {
      button = (
        <GoogleLogout
          clientId={CLIENT_ID}
          buttonText="Logout"
          onLogoutSuccess={this.logout}
        />
      )
    } else {
      button = (
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
    let manager
    if (this.state.managerOpen) {
      manager = <SubManager />
    }

    return (
      <div>
        <Card>
          <Card.Body>Welcome, {cardText}</Card.Body>
        </Card>
        {button}
        {this.state.isAuthenticated ? (
            <Button onClick={this.showSubscriptions}>Manage Subscriptions</Button>
        ) : null}
        {manager}
      </div>
    );
  }
}

export default App;
