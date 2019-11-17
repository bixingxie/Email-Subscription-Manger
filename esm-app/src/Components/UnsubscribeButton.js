import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

export function UnsubscribeButton(props) {
  const classes = useStyles();

  function unsubscribe(link) {
    fetch("http://localhost:4000/unsubscribe/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        link: link
      })
    })
    console.log(link)
  }

  return (
    <Tooltip title={props.link}>
      <Button onClick={() => unsubscribe(props.link)} >Unsubscribe</Button>
   </Tooltip>
  );
}
  
