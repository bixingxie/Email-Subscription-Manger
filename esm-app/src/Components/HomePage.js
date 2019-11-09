import React from "react";
import { SubscriptionTable } from "./SubscriptionTable";
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import localStorage from "local-storage";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import HomePageCard from "./HomePageCard";

// Given by Google API
const CLIENT_ID =
  "602826117073-lt0upfo5khvk59dqf0u50ruor73rrg6n.apps.googleusercontent.com";

export class HomePage extends React.Component {
  constructor() {
    const userInfo = JSON.parse(localStorage.get("userInfo"));

    super();
    this.state = {
      isAuthenticated: userInfo ? true : false,
      userEmail: userInfo ? userInfo.userEmail : null,
      userName: userInfo ? userInfo.userName : null,
      tokenObj: userInfo ? userInfo.tokenObj : null,
      token: "",
      subscriptions: {}
    };
  }

  handleLoginSuccess = response => {
    this.setState(
      {
        isAuthenticated: true,
        token: response.tokenId,
        userEmail: response.profileObj.email,
        userName: response.profileObj.name,
        tokenObj: response.tokenId
      },
      () => {
        this.sendUserToken();
        localStorage.set(
          "userInfo",
          JSON.stringify({
            tokenObj: this.state.tokenObj,
            userName: this.state.userName,
            userEmail: this.state.userEmail
          })
        );
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
    this.setState({ isAuthenticated: false, token: "", user: null }, () => {
      localStorage.clear();
    });
  };

  handleLoginFailure = error => {
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
          onSuccess={this.handleLoginSuccess}
          onFailure={this.handleLoginFailure}
          cookiePolicy={"single_host_origin"}
        />
      );
    }

    return (
      <Paper>
        <HomePageCard
          userName={this.state.userName ? this.state.userName : "please log in"}
        />

        <Card>
          {this.state.isAuthenticated ? <SubscriptionTable /> : <hr />}
        </Card>

        <Card>{logInOrOutButton}</Card>
      </Paper>
    );
  }
}
