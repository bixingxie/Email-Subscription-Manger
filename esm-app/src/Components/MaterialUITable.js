import React from 'react';
import { makeStyles, createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
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
  
const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

export function MaterialUITable(props) {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
        <Paper className={classes.root}>
        <Table className={classes.table} aria-label="simple table">
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
                <TableCell>{props.data[key]}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </Paper>
    </ThemeProvider>
  );
}


