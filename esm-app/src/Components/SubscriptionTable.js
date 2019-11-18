import React from "react";
import {TableContent} from "./TableContent"
import {Spinner} from "./Spinner"

export class SubscriptionTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      loaded: false
    };
  }

  persistUnsubscribeToDB = vendor => {
    fetch(`http://localhost:4000/persistUnsubscribe/?vendor=${vendor}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(console.log("persistUnsubscribeToDB: SUCCUESS"))
  }

  handlesUnsubscribe = vendor =>  {
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
    .then((response) => {
      if (response.status === "SUCCESS") {
        const {[vendor]: value, ...newData} = this.state.data
        this.setState({data: newData})
        this.persistUnsubscribeToDB(vendor)
      } else {
        console.log("error unsubbing")
      }
    })
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
        <TableContent data={this.state.data} handlesUnsubscribe={this.handlesUnsubscribe}/>
      );
    } else {
      content = (
        <Spinner/>
      );
    }

    return <div>{content}</div>;
  }
}
