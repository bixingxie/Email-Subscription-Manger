import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 40
  },
  pos: {
    marginBottom: 12
  }
});

export default function HomePageCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography
          variant="h4"
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Email Subscriptions Manager
        </Typography>
        <Typography variant="h6" component="p">
          Welcome, {props.userName}
          <br />
          {"Time to clean your cluttered inbox!"}
        </Typography>
      </CardContent>
    </Card>
  );
}
