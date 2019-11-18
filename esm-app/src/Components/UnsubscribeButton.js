import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

export function UnsubscribeButton(props) {
  return (
    <Tooltip title={props.link}>
      <Button onClick={() => props.onClick(props.vendor)} >Unsubscribe</Button>
   </Tooltip>
  );
}
  
