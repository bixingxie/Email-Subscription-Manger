import React from "react";
import { HomePageBody } from "./HomePageBody";
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import localStorage from "local-storage";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import {Spinner} from "./Spinner"
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
      subscriptions: {}, 
      fetchDone: null
    };
  }

  handleLoginSuccess = response => {
    this.setState(
      {
        isAuthenticated: true,
        token: response.tokenId,
        userEmail: response.profileObj.email,
        userName: response.profileObj.name,
        tokenObj: response.tokenObj, 
        fetchDone: false
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

  sendUserToken = () => {
    fetch("http://localhost:4000/get_token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.tokenObj),
    })
    .then((res) => {
      this.setState({fetchDone: true})
    })
    .catch(err => {
      console.log(err)
    })
  };

  sendUserEmail = (email) => {
    fetch(`http://localhost:4000/get_email/?email=${email}`, {
      headers: {
        Accept: "application/jsosn",
        "Content-Type": "application/json"
      }
    })
    .then(response => (console.log(response)))
  }

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
      this.sendUserEmail(this.state.userEmail || JSON.parse(localStorage.get("userInfo")).userEmail)
    }

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

        <Card>{this.state.isAuthenticated 
          ? (this.state.fetchDone === false ? <Spinner/> : <HomePageBody /> )
          : <hr />}</Card>

        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "10vh" }}
        >
          <Grid item xs={3}>
            <Card>{logInOrOutButton}</Card>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
