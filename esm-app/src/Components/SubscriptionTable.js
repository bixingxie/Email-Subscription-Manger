import React from "react";
import {MaterialUITable} from "./MaterialUITable"
import {MaterialUISpinner} from "./MaterialUISpinner"


export class SubscriptionTable extends React.Component {
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
    const isLoaded = this.state.loaded;
    let content;

    if (isLoaded) {
      content = (
        <MaterialUITable data={this.state.data}/>
      );
    } else {
      content = (
        <MaterialUISpinner/>
      );
    }

    return <div>{content}</div>;
  }
}
