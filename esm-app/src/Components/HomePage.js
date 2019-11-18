import React from "react";
import { HomePageBody } from "./HomePageBody"
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import localStorage from "local-storage";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import HomePageHeader from "./HomePageHeader";

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
        tokenObj: response.tokenObj
      },
      () => {
        console.log(this.state.tokenObj)
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
    console.log(this.state.tokenObj)
    fetch("http://localhost:4000/get_token/", {
      method: "POST",
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify([this.state.tokenObj, this.state.userEmail]),
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
        <HomePageHeader
          userName={this.state.userName ? this.state.userName : "please log in"}
        />
        
        <Card>
          {this.state.isAuthenticated ? <HomePageBody /> : <hr />}
        </Card>

        <Card>{logInOrOutButton}</Card>

      </Paper>
    );
  }
}
