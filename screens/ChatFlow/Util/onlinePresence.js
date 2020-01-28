import io from "socket.io-client";
import { server_presence, myIP } from "../../../config/ipconfig";

export function onlineIndicator(user) {
  const socket = io(`http://localhost:3000/?token=${user}`);
  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("retrieving users");
  });
  socket.on("retrieving users", data => {
    console.log("array", data);
    this.setState({
      onlineUserList: data
    });
    console.log(this.state.onlineUserList);
  });
}

export async function getOnlineStatus(user) {
  console.log(`fetching (${user}) status`);
  var res = await fetch(`${server_presence}/api/presence/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userGuid: user
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(`Request made for (${user}) status`, data);
      return data;
    })
    .catch(error => {
      console.log("Error", error);
    });
  return res;
}

// socket.on('connect', () => {

//   console.log('Connected to server'); // true
//   fetch(`${server_presence}/api/presence`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       userGuid: user,
//       status: true
//     })
//   })
//   .then((response) => {
//     console.log('Request successfully made', user);
//   })
//   .catch((error) => {
//     console.log('Request failed', error)
//   })
// });
