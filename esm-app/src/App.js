import React from "react";
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import { Jumbotron, Button, Table } from "reactstrap";
import "./App.css";

// Given by Google API
const CLIENT_ID =
  "602826117073-lt0upfo5khvk59dqf0u50ruor73rrg6n.apps.googleusercontent.com";

class App extends React.Component {
  render() {
    var login = <Login />;

    return <div>{login}</div>;
  }
}

class SubscriptionManager extends React.Component {
  constructor() {
    super();
    this.state = { data: null };
  }

  componentDidMount() {
    fetch("http://localhost:4000/subscriptionManagement/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => this.setState({ data: data }));
  }

  render() {
    const data = this.state.data
    if (data !== null) {
      Object.keys(data).forEach((item) => {
        console.log(item)
        console.log(data[item]['subscription'][0][1])
      })
    }

    return (
      <Table>
        <thead>
          <tr>
            <th>Vendor Name</th>
            <th>Unsubscribe Link</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.data ? Object.keys(this.state.data).map(
              (key) => {
                return (
                  <tr>
                    <td>{key}</td>
                    {data[key]['subscription'][0][1]}
                  </tr>
                )
              }
            ) : null
          }
        </tbody>
            </Table>
    );
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

  showSubscriptions = () => {
    this.setState({ managerOpen: !this.state.managerOpen });
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
        <Jumbotron>
          <div className="title">
            <h1> Email Subscription Manager </h1>
          </div>
          <div className="login">
            <div className="loginBox">
                {" "}
                Welcome,{" "}
                {this.state.isAuthenticated
                  ? this.state.userName
                  : "Please log in"}{" "}

            <div className="loginButton">
              {logInOrOutButton}
            </div>
            </div>
          </div>
          <hr />
          {this.state.isAuthenticated ? (
            <Button color="primary" onClick={this.showSubscriptions}>
              Manage Subscriptions
            </Button>
          ) : null}
          {this.state.managerOpen ? <SubscriptionManager /> : null}
        </Jumbotron>
      </div>
    );
  }
}

export default App;
