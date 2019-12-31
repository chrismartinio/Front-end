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
export function calculateLastMessageDate(dateStr) {
  let today = new Date();
  let lastMessageDate = new Date(dateStr);

  let oneSecondInMS = 1000;
  let oneMinuteInMS = oneSecondInMS * 60;
  let oneHourInMS = oneMinuteInMS * 60;
  let oneDayInMS = oneHourInMS * 24;
  let oneWeekInMS = oneDayInMS * 7;
  let oneMonthInMS = oneDayInMS * 30.436875;
  let oneYearInMS = oneDayInMS * 365.2425;

  let todayTime = today.getTime();
  let lastMessageDateTime = lastMessageDate.getTime();

  let ms = todayTime - lastMessageDateTime;

  //greater or equal than one year
  if (ms >= oneYearInMS) {
    let year = Math.floor(ms / oneYearInMS);
    return `${year} ${year > 1 ? "years" : "year"} ago`;
  }

  //greater or equal than one month
  if (ms >= oneMonthInMS) {
    let month = Math.floor(ms / oneMonthInMS);
    return `${month} ${month > 1 ? "months" : "month"} ago`;
  }

  //greater or equal than one week
  if (ms >= oneWeekInMS) {
    let week = Math.floor(ms / oneWeekInMS);
    return `${week} ${week > 1 ? "weeks" : "week"} ago`;
  }

  //greater or equal than one day
  if (ms >= oneDayInMS) {
    let day = Math.floor(ms / oneDayInMS);
    return `${day} ${day > 1 ? "days" : "day"} ago`;
  }

  //greater or equal than one hour
  if (ms >= oneHourInMS) {
    let hour = Math.floor(ms / oneHourInMS);
    return `${hour} ${hour > 1 ? "hours" : "hour"} ago`;
  }

  //greater or equal than one minute
  if (ms >= oneMinuteInMS) {
    let minute = Math.floor(ms / oneMinuteInMS);
    return `${minute} ${minute > 1 ? "minutes" : "minute"} ago`;
  }

  if (ms >= oneSecondInMS) {
    let second = Math.floor(ms / oneSecondInMS);
    return `${second} ${second > 1 ? "seconds" : "second"} ago`;
  }

  if (ms < oneSecondInMS) {
    return "less than a second ago";
  }
}
