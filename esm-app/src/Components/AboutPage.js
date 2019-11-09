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
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

export default function AboutPage() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Email Subscription Manager (ESM) is a web application developed with
          Node.JS, Express, React.JS, and MySQL. ESM helps to clean the user's
          cluttered email inbox.
        </Typography>
        <Typography variant="h6" component="p">
          Created by:
          <br />
          Bixing Xie
          <br />
          Bronson Lee
          <br />
          Mengzhe Ding
          <br />
        </Typography>
        <Typography variant="h5" component="h2"></Typography>
      </CardContent>
    </Card>
  );
}
