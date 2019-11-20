import React from "react";
import { TableContent } from "./TableContent";
import { Spinner } from "./Spinner";
import { MySnackbarContentWrapper } from "./MySnackbarContentWrapper";
import Snackbar from "@material-ui/core/Snackbar";

export class SubscriptionTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      loaded: false,
      unsubInProgress: false,
      oneClickSuccess: null,
      isSnackbarOpen: false
    };
  }

  persistUnsubscribeToDB = vendor => {
    fetch(`http://localhost:4000/persistUnsubscribe/?vendor=${vendor}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(console.log("persistUnsubscribeToDB: SUCCUESS"));
  };

  handlesUnsubscribe = vendor => {
    this.setState({ unsubInProgress: true }, () => {
      console.log(this.state.data[vendor]["url"])
      fetch("http://localhost:4000/unsubscribe/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          link: this.state.data[vendor]["url"]
        })
      })
        .then(response => response.json())
        .then(response => {
          if (response.status === "SUCCESS") {
            const { [vendor]: value, ...newData } = this.state.data;
            this.setState({
              data: newData,
              oneClickSuccess: true,
              isSnackbarOpen: true
            });
            this.persistUnsubscribeToDB(vendor);
          } else {
            this.setState({ oneClickSuccess: false });
            console.log("error unsubbing");
          }
          this.setState({ unsubInProgress: false, isSnackbarOpen: true });
        });
    });
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ isSnackbarOpen: false });
  };

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
    let content;

    if (this.state.loaded) {
      content = (
        <TableContent
          data={this.state.data}
          handlesUnsubscribe={this.handlesUnsubscribe}
          unsubInProgress={this.state.unsubInProgress}
        />
      );
    } else {
      content = <Spinner />;
    }

    return (
      <div>
        {content}
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={this.state.isSnackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleSnackbarClose}
            variant={this.state.oneClickSuccess === true ? "success" : "info"}
            message={
              this.state.oneClickSuccess === true
                ? "Successfully 1-click Unsubscribed!"
                : "1-Click Not Available. Unsubscribe by visitng the url"
            }
          />
        </Snackbar>
      </div>
    );
  }
}
