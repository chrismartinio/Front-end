import io from "socket.io-client";
import { server_presence } from "../../../config/ipconfig";

export function onlineIndicator(user) {
  console.log('Online indicator activated');
  const socket = io(`http://192.168.4.151:5040/?token=${user}`);
  /* sending the user as a token so the server can handle disconnecting the user for increase opitmization*/
  socket.on('connect', () => {
    console.log('Connected to server'); // true
    fetch(`${server_presence}/api/presence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userGuid: user,
        status: true
      })
    })
    .then(() => {
      console.log('Request successfully made', user);
    })
    .catch((error) => {
      console.log('Request failed', error)
    })
  });
  // socket.on('disconnect', () => {
  //   console.log('Disconnect has been fired') // false
  //   fetch(`http://192.168.4.151:5040/api/presence`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       userGuid: user,
  //       status: false
  //     })
  //   })
  //   .then(() => {
  //     console.log('offline request successfully made', user);
  //   })
  //   .catch((error) => {
  //     console.log('request failed', error)
  //   })
  // })


}

export function getOnlineStatu(user) {
  console.log(`fetching (${user}) status`);
  fetch(`${server_presence}/api/presence`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userGuid: user,
    })
  })
  .then(() => {
    console.log(`Request made for (${user}) status`);
  })
  .catch((error) => {
    console.log('Error', error);
  })
}