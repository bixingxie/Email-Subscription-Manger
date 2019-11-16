import React from "react";
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

export function MaterialUITable(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell> # </TableCell>
              <TableCell> Subscription Name </TableCell>
              <TableCell> Unsubscribe Link </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(props.data).map((key, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {index}
                </TableCell>
                <TableCell>{key}</TableCell>
                <TableCell>
                  <UnsubscribeButton link={props.data[key]}></UnsubscribeButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}
