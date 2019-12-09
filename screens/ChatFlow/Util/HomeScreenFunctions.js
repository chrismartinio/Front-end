export function degToRad(degree) {
  return (degree * Math.PI) / 180;
}

export function shortTheMessage(message) {
  return message.slice(0, 30) + "...";
}
