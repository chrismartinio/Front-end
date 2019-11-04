//================================
// createAccount
//================================

export function emailCheck(email) {
  // email validty check?
  const checkAT = email.indexOf("@");
  const checkCOM = email.indexOf(".com");
  if (checkAT > 0 && checkCOM > 0 && email.length > 4) {
    return true;
  }
  return false;
}

export function nullCheck(value) {
  if (value !== "") {
    return true;
  }
  return false;
}

export function passwordLength(password) {
  if (!(password.length >= 8)) {
    return false;
  }
  return true;
}

export function passwordCase(password) {
  // use positive look ahead to see if at least one lower case letter exists
  //let regExp = /^(?=.*[a-z])/;
  // use positive look ahead to see if at least one upper case letter exists
  //regExp = /^(?=.*[A-Z])/;
  if (!(/^(?=.*[a-z])/.test(password) && /^(?=.*[A-Z])/.test(password))) {
    return false;
  }
  return true;
}

export function passwordNonLetter(password) {
  // use positive look ahead to see if at least one digit exists
  //let regExp = /^(?=.*[0-9])/;
  // use positive look ahead to see if at least one non-word character exists
  //regExp = /^(?=.*\W)/;
  if (!(/^(?=.*[0-9])/.test(password) || /^(?=.*\W)/.test(password))) {
    return false;
  }
  return true;
}

export function passwordCheck(password) {
  let pLength = passwordLength(password);
  let pCase = passwordCase(password);
  let pNonLetter = passwordNonLetter(password);

  if (pLength === false) {
    return false;
  }
  if (pCase === false) {
    return false;
  }
  if (pNonLetter === false) {
    return false;
  }

  return true;
}

//================================
// aboutYou
//================================
//return true/false for valid zipcode
export function checkZipCode(zipcode) {
  return /^\d{5}(-\d{4})?$/.test(zipcode);
}

//return true/false for valid first name and last name
export function checkName(string) {
  //check if string has only space
  if (!string.replace(/\s/g, "").length) {
    return false;
  }

  //check letters and spaces
  let regExp = /^[a-zA-Z\s]*$/;
  if (regExp.test(string)) {
    return true;
  }
  return false;
}

//date picker method : return maximun date (current date) that user can pick
export function maxDate() {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  return year.toString() + "-" + month.toString() + "-" + day.toString();
}

//date picker method : return minimum date (current date - 150) that user can pick
export function minDate() {
  let d = new Date();
  //assume 120 year olds
  let year = d.getFullYear() - 150;
  let month = d.getMonth() + 1;
  let day = d.getDate();
  return year.toString() + "-" + month.toString() + "-" + day.toString();
}

//return true/false for valid birthdate (over 18)
export function checkage(birthdate) {
  let byear = parseInt(birthdate.slice(0, 4));
  let bmonth = parseInt(birthdate.slice(5, 7));
  let bday = parseInt(birthdate.slice(8, 10));

  let d = new Date();
  let age = d.getFullYear() - byear;
  let month = d.getMonth() + 1 - bmonth;
  if (month < 0 || (month === 0 && d.getDate() < bday)) {
    age--;
  }

  if (age < 18) {
    return false;
  }

  return true;
}

//================================
// preferences
//================================
export function genderChecker(pickedMen, pickedWomen) {
  if (pickedMen === true || pickedWomen === true) {
    return true;
  }
  return false;
}

//================================
// interests
//================================
export function likesChecker(likesArrayLength) {
  if (likesArrayLength === 3) {
    return true;
  }
  return false;
}

//================================
// localDestination
//================================
export function locationsChecker(localDestination) {
  if (localDestination !== "") {
    return true;
  }
  return false;
}
