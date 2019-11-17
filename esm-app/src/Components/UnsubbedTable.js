import React from "react";
import {TableContent} from "./TableContent"
import {Spinner} from "./Spinner"

export class UnsubbedTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      loaded: false
    };
  }

  componentDidMount() {
    fetch("http://localhost:4000/manage_subscription/?unsub=1", {
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
        <TableContent data={this.state.data} unsub/>
      );
    } else {
      content = (
        <Spinner/>
      );
    }

    return <div>{content}</div>;
  }
}
