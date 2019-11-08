import React from "react";
import { Table, Spinner } from "reactstrap";

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
    return (
      <div>
        {this.state.loaded ? (
          <Table dark>
            <thead>
              <tr>
                <th>#</th>
                <th>Vendor Name</th>
                <th>Link to Unsubscribe</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.data).map((key, index) => {
                return (
                  <tr>
                    <th scope="row">{index}</th>
                    <td>{key}</td>
                    <td>{this.state.data[key]}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <Spinner color="dark" />
        )}
      </div>
    );
  }
}
