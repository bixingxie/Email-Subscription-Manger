import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UnsubscribeButton } from "./Unsubscribe";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    root: {
        width: "100%",
        overflowX: "auto"
    },
    table: {
        minWidth: 650
    }
});

export class MaterialUITable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classes: useStyles
    }
  }
  // unsubscribe(link) {
  //   fetch("http://localhost:4000/unsubscribe/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: link,
  //   });
  // }
  render() {
    return (
      <Paper className={this.state.classes.root}>
          <Table className={this.state.classes.table} aria-label="simple table">
              <TableHead>
              <TableRow>
                  <TableCell> # </TableCell>
                  <TableCell> Subscription Name </TableCell>
                  <TableCell> Unsubscribe Link </TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
              {Object.keys(this.props.data).map((key, index) => (
                  <TableRow key={index}>
                  <TableCell component="th" scope="row">
                      {index}
                  </TableCell>
                  <TableCell>{key}</TableCell>
                  <TableCell><UnsubscribeButton link={this.props.data[key]}></UnsubscribeButton></TableCell>
                  </TableRow>
              ))}
              </TableBody>
          </Table>
      </Paper>
    );
  }
}
