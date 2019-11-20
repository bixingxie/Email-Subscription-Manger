import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { UnsubscribeButton } from "./UnsubscribeButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  tableWrapper: {
    maxHeight: 1000,
    overflow: "auto"
  }
});

export function TableContent(props) {
  const classes = useStyles();
  let tableHead;
  let tableBody;

  if (props.unsub) {
    tableHead = (
      <TableHead>
        <TableRow>
          <TableCell> # </TableCell>
          <TableCell> Subscription Name </TableCell>
          <TableCell> Unsubscribed Date </TableCell>
        </TableRow>
      </TableHead>
    );
    tableBody = (
      <TableBody>
        {Object.keys(props.data).map((key, index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {index}
            </TableCell>
            <TableCell>{key}</TableCell>
            <TableCell>{props.data[key]["date"]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  } else {
    tableHead = (
      <TableHead>
        <TableRow>
          <TableCell> # </TableCell>
          <TableCell> Subscription Name </TableCell>
          <TableCell> Unsubscribe Link </TableCell>
        </TableRow>
      </TableHead>
    );
    tableBody = (
      <TableBody>
        {Object.keys(props.data).map((key, index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {index}
            </TableCell>
            <TableCell>{key}</TableCell>
            <TableCell>
              <UnsubscribeButton 
                vendor={key} 
                link={props.data[key]["url"]} 
                onClick={props.handlesUnsubscribe} 
                unsubInProgress={props.unsubInProgress}>
              </UnsubscribeButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label="sticky table">
          {tableHead}
          {tableBody}
        </Table>
      </div>
    </Paper>
  );
}
