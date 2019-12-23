//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");

//DISPLAY DEVICE'S USER PROFILE DATA (ONE TABLE)
export function selectDataFromLocalStorage(tableName, id) {
  return new Promise((resolve, reject) => {
    db.transaction(
      //callback
      tx => {
        //DISPLAY DATA
        let selectSqlStatement = `select * from ${tableName} where id="${id}"`;
        tx.executeSql(
          selectSqlStatement,
          null,
          (tx, result) => {
            console.log(
              `\n### DISPLAY  Data from ${tableName} ### : Success!\n`
            );
            if (result.rows.length <= 0) {
              console.log("No data is in the localStorage");
              resolve({ success: false });
            }
            resolve({ result: result, success: true });
          },
          (tx, err) => {
            console.log(`\n### DISPLAY  Data from ${tableName} ### : Fail!\n`);
            console.log(err);
          }
        );
      },
      //Transaction error
      null,
      //Transaction success
      null
    );
  });
}

//DISPLAY MATCHED USER PROFILE DATA BY GUID(ONE TABLE)
export function selectIdByGuidFromLocalStorage(tableName, guid) {
  return new Promise((resolve, reject) => {
    db.transaction(
      //callback
      tx => {
        //DISPLAY DATA
        let selectSqlStatement = `select id from ${tableName} where guid="${guid}"`;
        tx.executeSql(
          selectSqlStatement,
          null,
          (tx, result) => {
            console.log(
              `\n### DISPLAY ID from ${tableName} BY ${guid} ### : Success!\n`
            );
            if (result.rows.length <= 0) {
              console.log("No data is in the localStorage");
              resolve({ success: false });
            }
            resolve({ result: result, success: true });
          },
          (tx, err) => {
            console.log(
              `\n### DISPLAY ID from ${tableName} BY ${guid} ### : Fail!\n`
            );
            console.log(err);
          }
        );
      },
      //Transaction error
      null,
      //Transaction success
      null
    );
  });
}

//INSERT OR UPDATE DEVICE'S USER PROFILE DATA (ONE TABLE)
export function insertDataIntoLocalStorage(
  sqlStatement,
  tableName,
  dataArray,
  display
) {
  return new Promise((resolve, reject) => {
    db.transaction(
      //callback
      tx => {
        //INSERT DATA
        tx.executeSql(
          sqlStatement,
          dataArray,
          (tx, result) => {
            console.log(`### INSERTED Data into ${tableName} ### : Success!\n`);
            resolve({ success: true });
          },
          (tx, err) => {
            console.log(`### INSERTED Data into ${tableName} ### : Fail!!\n`);
            console.log(err);
            resolve({ success: false });
          }
        );

        //DISPLAY DATA
        if (display) {
          let selectSqlStatement = `select * from ${tableName}`;
          tx.executeSql(
            selectSqlStatement,
            null,
            (tx, result) => {
              console.log(
                `### DISPLAY  Data from ${tableName} ### : Success!\n`
              );
              console.log(result);
            },
            (tx, err) => {
              console.log(`### DISPLAY  Data from ${tableName} ### : Fail!\n`);
              console.log(err);
            }
          );
        }
      },
      //Transaction error
      null,
      //Transaction success
      null
    );
  });
}
//CREATE TABLES FOR MATCHED USER PROFILE
export function createMatchedUserTablesInToLocalStorage() {
  let matchedUserInfoSqlStatement =
    "CREATE TABLE IF NOT EXISTS matched_user_info ( " +
    "id INTEGER PRIMARY KEY," +
    "guid TEXT DEFAULT NULL," +
    "image TEXT DEFAULT NULL," +
    "addressLatitude TEXT DEFAULT NULL," +
    "addressLongitude TEXT DEFAULT NULL," +
    "birthDate TEXT DEFAULT NULL," +
    "firstName TEXT DEFAULT NULL," +
    "lastName TEXT DEFAULT NULL," +
    "zipCode TEXT DEFAULT NULL," +
    "userBio TEXT DEFAULT NULL," +
    "city TEXT DEFAULT NULL," +
    "state TEXT DEFAULT NULL," +
    "likesArray TEXT DEFAULT NULL" +
    " );";

  return new Promise((resolve, reject) => {
    db.transaction(
      //callback
      tx => {
        tx.executeSql(
          matchedUserInfoSqlStatement,
          null,
          (tx, result) => {
            console.log(`matched_user_info is created \n`);
          },
          (tx, err) => {
            console.log(`Failed creating matched_user_info\n`);
            console.log(err);
          }
        );
      },
      //Transaction error
      null,
      //Transaction success
      null
    );
  });
}

//CREATE TABLES FOR DEVICE'S USER PROFILE (MULTIPLE TABLES)
export function createTablesInToLocalStorage() {
  let createAccountSqlStatement =
    "CREATE TABLE IF NOT EXISTS device_user_createAccount ( " +
    "id INTEGER PRIMARY KEY," +
    "image TEXT DEFAULT NULL," +
    "guid TEXT DEFAULT NULL," +
    "email TEXT DEFAULT NULL," +
    "password TEXT DEFAULT NULL," +
    "isAdmin BOOLEAN DEFAULT NULL," +
    "checklist TEXT DEFAULT NULL," +
    "phoneNumber TEXT DEFAULT NULL," +
    "deviceID TEXT DEFAULT NULL," +
    "deviceLatLong TEXT DEFAULT NULL," +
    "deviceAltitude TEXT DEFAULT NULL," +
    "addressLatitude TEXT DEFAULT NULL," +
    "addressLongitude TEXT DEFAULT NULL" +
    " );";

  let aboutYouSqlStatement =
    "CREATE TABLE IF NOT EXISTS device_user_aboutYou ( " +
    "id INTEGER PRIMARY KEY," +
    "birthDate TEXT DEFAULT NULL," +
    "country TEXT DEFAULT NULL," +
    "firstName TEXT DEFAULT NULL," +
    "lastName TEXT DEFAULT NULL," +
    "gender TEXT DEFAULT NULL," +
    "zipCode TEXT DEFAULT NULL," +
    "userBio TEXT DEFAULT NULL," +
    "city TEXT DEFAULT NULL," +
    "state TEXT DEFAULT NULL," +
    "createAccount_id INTEGER," +
    "guid TEXT DEFAULT NULL," +
    "FOREIGN KEY (createAccount_id) REFERENCES device_user_createAccount (id)" +
    " );";

  let preferencesSqlStatement =
    "CREATE TABLE IF NOT EXISTS device_user_preferences ( " +
    "id INTEGER PRIMARY KEY," +
    "interestedGender TEXT DEFAULT NULL," +
    "ageRange TEXT DEFAULT NULL," +
    "distanceRange INTEGER DEFAULT NULL," +
    "createAccount_id INTEGER," +
    "guid TEXT DEFAULT NULL," +
    "FOREIGN KEY (createAccount_id) REFERENCES device_user_createAccount (id)" +
    " );";

  let interestsSqlStatement =
    "CREATE TABLE IF NOT EXISTS device_user_interests ( " +
    "id INTEGER PRIMARY KEY," +
    "likesArray TEXT DEFAULT NULL," +
    "createAccount_id INTEGER," +
    "guid TEXT DEFAULT NULL," +
    "FOREIGN KEY (createAccount_id) REFERENCES device_user_createAccount (id)" +
    " );";

  let wouldYouRatherSqlStatement =
    "CREATE TABLE IF NOT EXISTS device_user_wouldYouRather ( " +
    "id INTEGER PRIMARY KEY," +
    "s1r1 DECIMAL DEFAULT NULL," +
    "s1r2 DECIMAL DEFAULT NULL," +
    "s2r1 DECIMAL DEFAULT NULL," +
    "s2r2 DECIMAL DEFAULT NULL," +
    "s3r1 DECIMAL DEFAULT NULL," +
    "s3r2 DECIMAL DEFAULT NULL," +
    "createAccount_id INTEGER," +
    "guid TEXT DEFAULT NULL," +
    "FOREIGN KEY (createAccount_id) REFERENCES device_user_createAccount (id)" +
    " );";

  let localDestinationSqlStatement =
    "CREATE TABLE IF NOT EXISTS device_user_localDestination ( " +
    "id INTEGER PRIMARY KEY," +
    "localDestination TEXT DEFAULT NULL," +
    "createAccount_id INTEGER," +
    "guid TEXT DEFAULT NULL," +
    "FOREIGN KEY (createAccount_id) REFERENCES device_user_createAccount (id)" +
    " );";

  let createTable_SqlStatementsArray = [
    {
      tableName: "device_user_createAccount",
      sqlStatement: createAccountSqlStatement
    },
    { tableName: "device_user_aboutYou", sqlStatement: aboutYouSqlStatement },
    {
      tableName: "device_user_preferences",
      sqlStatement: preferencesSqlStatement
    },
    { tableName: "device_user_interests", sqlStatement: interestsSqlStatement },
    {
      tableName: "device_user_wouldYouRather",
      sqlStatement: wouldYouRatherSqlStatement
    },
    {
      tableName: "device_user_localDestination",
      sqlStatement: localDestinationSqlStatement
    }
  ];
  return new Promise((resolve, reject) => {
    db.transaction(
      //callback
      tx => {
        createTable_SqlStatementsArray.map(e => {
          tx.executeSql(
            e.sqlStatement,
            null,
            (tx, result) => {
              console.log(`${e.tableName} is created \n`);
            },
            (tx, err) => {
              console.log(`Failed creating ${e.tableName}\n`);
              console.log(err);
            }
          );
        });
      },
      //Transaction error
      null,
      //Transaction success
      null
    );
  });
}

//DISPLAY ALL TABLES IN SQLITE (MULTIPLE TABLES)
//DISPLAY ALL DATA IN PROFILE TABLES (MULTIPLE TABLES)
export function displayAllTablesFromLocalStorage() {
  let displayTable_SqlStatementsArray = [
    {
      tableName: "device_user_createAccount",
      sqlStatement: "SELECT * FROM device_user_createAccount"
    },
    {
      tableName: "device_user_aboutYou",
      sqlStatement: "SELECT * FROM device_user_aboutYou"
    },
    {
      tableName: "device_user_preferences",
      sqlStatement: "SELECT * FROM device_user_preferences"
    },
    {
      tableName: "device_user_interests",
      sqlStatement: "SELECT * FROM device_user_interests"
    },
    {
      tableName: "device_user_wouldYouRather",
      sqlStatement: "SELECT * FROM device_user_wouldYouRather"
    },
    {
      tableName: "device_user_localDestination",
      sqlStatement: "SELECT * FROM device_user_localDestination"
    },
    {
      tableName: "matched_user_info",
      sqlStatement: "SELECT * FROM matched_user_info"
    }
  ];
  return new Promise((resolve, reject) => {
    db.transaction(
      //callback
      tx => {
        //LOG ALL TABLES
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
          null,
          (tx, result) => {
            console.log(
              `### DISPLAY All EXISTING TABLES IN LOCALSTORAGE ### : Success!\n`
            );
            console.log(result);
          },
          (tx, err) => {
            console.log(
              `### All EXISTING TABLES IN LOCALSTORAGE ### : Fail!\n`
            );
            console.log(err);
          }
        );

        displayTable_SqlStatementsArray.map(e => {
          tx.executeSql(
            e.sqlStatement,
            null,
            (tx, result) => {
              console.log(
                `### DISPLAY  Data from ${e.tableName} ### : Success!\n`
              );
              console.log(result);
            },
            (tx, err) => {
              console.log(
                `### DISPLAY  Data from ${e.tableName} ### : Fail!\n`
              );
              console.log(err);
            }
          );
        });
      },
      //Transaction error
      null,
      //Transaction success
      null
    );
  });
}

//DROP ALL PROFILE TABLES (MULTIPLE TABLES)
export function dropAllTablesInLocalStorage() {
  let dropTable_SqlStatementsArray = [
    {
      tableName: "device_user_createAccount",
      sqlStatement: "DROP TABLE device_user_createAccount"
    },
    {
      tableName: "device_user_aboutYou",
      sqlStatement: "DROP TABLE device_user_aboutYou"
    },
    {
      tableName: "device_user_preferences",
      sqlStatement: "DROP TABLE device_user_preferences"
    },
    {
      tableName: "device_user_interests",
      sqlStatement: "DROP TABLE device_user_interests"
    },
    {
      tableName: "device_user_wouldYouRather",
      sqlStatement: "DROP TABLE device_user_wouldYouRather"
    },
    {
      tableName: "device_user_localDestination",
      sqlStatement: "DROP TABLE device_user_localDestination"
    },
    {
      tableName: "matched_user_info",
      sqlStatement: "DROP TABLE matched_user_info"
    }
  ];
  return new Promise((resolve, reject) => {
    db.transaction(
      //callback
      tx => {
        dropTable_SqlStatementsArray.map(e => {
          tx.executeSql(
            e.sqlStatement,
            null,
            (tx, result) => {
              console.log(`${e.tableName} is dropped \n`);
            },
            (tx, err) => {
              console.log(`Failed dropping ${e.tableName}\n`);
              console.log(err);
            }
          );
        });
      },
      //Transaction error
      null,
      //Transaction success
      null
    );
  });
}

//DELETE DEVICE'S USER DATA (MULTIPLE TABLE)
export function deleteDeviceUserData() {
  let deleteDeviceUserData_SqlStatementsArray = [
    {
      tableName: "device_user_createAccount",
      sqlStatement: "DELETE FROM device_user_createAccount WHERE id = 1;"
    },
    {
      tableName: "device_user_aboutYou",
      sqlStatement: "DELETE FROM device_user_aboutYou WHERE id = 1;"
    },
    {
      tableName: "device_user_preferences",
      sqlStatement: "DELETE FROM device_user_preferences WHERE id = 1;"
    },
    {
      tableName: "device_user_interests",
      sqlStatement: "DELETE FROM device_user_interests WHERE id = 1;"
    },
    {
      tableName: "device_user_wouldYouRather",
      sqlStatement: "DELETE FROM device_user_wouldYouRather WHERE id = 1;"
    },
    {
      tableName: "device_user_localDestination",
      sqlStatement: "DELETE FROM device_user_localDestination WHERE id = 1;"
    }
  ];
  return new Promise((resolve, reject) => {
    db.transaction(
      //callback
      tx => {
        deleteDeviceUserData_SqlStatementsArray.map(e => {
          tx.executeSql(
            e.sqlStatement,
            null,
            (tx, result) => {
              console.log(`${e.tableName} is Deleted \n`);
            },
            (tx, err) => {
              console.log(`Failed Deleting ${e.tableName}\n`);
              console.log(err);
            }
          );
        });
      },
      //Transaction error
      null,
      //Transaction success
      null
    );
  });
}
