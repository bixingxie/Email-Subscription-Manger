import React from 'react';

export function UnsubscribeButton(props) {
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
    <button onClick={() => unsubscribe(props.link)}>Unsubscribe</button>
  );
}
  
