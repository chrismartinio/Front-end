export function degToRad(degree) {
  return (degree * Math.PI) / 180;
}

export function shortTheMessage(message) {
  if (message.length > 20) {
    return message.slice(0, 20) + "...";
  }
  return message;
}

export function shortName(str) {
  let length = str.length + 2;

  if (length > 6) {
    return 0.035;
  }
  return 0.047;
}

export function shortAgeAndAddressSTR(str) {
  let length = str.length + 2;
  if (length > 10) {
    return 0.015;
  }
  return 0.038;
}
