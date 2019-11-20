import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import {Spinner} from "./Spinner"

export function UnsubscribeButton(props) {
  let content; 
  if (props.unsubInProgress) {
    content = (<Spinner/>)
  } else {
    content = ( <Tooltip title={props.link}>
      <Button onClick={() => props.onClick(props.vendor)} >Unsubscribe</Button>
   </Tooltip>)
  }
  return (
    content
  );
}
  
