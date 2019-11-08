import React from "react";
import { SubscriptionTable } from "./SubscriptionTable";
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import localStorage from 'local-storage'


// Given by Google API
const CLIENT_ID =
  "602826117073-lt0upfo5khvk59dqf0u50ruor73rrg6n.apps.googleusercontent.com";

export class HomePage extends React.Component {
  constructor() {
    const userInfo = JSON.parse(localStorage.get('userInfo')) 

    super();
    this.state = {
      isAuthenticated: userInfo ? true : false,
      userEmail: (userInfo ? userInfo.userEmail : null), 
      userName: (userInfo ? userInfo.userName : null), 
      tokenObj: (userInfo ? userInfo.tokenObj : null),
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
        tokenObj: response.tokenId   
      }, 
      () => {
        this.sendUserToken();
        localStorage.set('userInfo', JSON.stringify({
            tokenObj: this.state.tokenObj, 
            userName: this.state.userName, 
            userEmail: this.state.userEmail
        }));
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
    this.setState({ isAuthenticated: false, token: "", user: null }, ()=>{
        localStorage.clear();
    });
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

            {this.state.isAuthenticated ? <SubscriptionTable /> : <hr />}

            {logInOrOutButton}
          </CardBody>
        </Card>
      </div>
    );
  }
}
