//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");

export function selectDataFromLocalStorage(tableName) {
  return new Promise((resolve, reject) => {
    db.transaction(
      //callback
      tx => {
        //DISPLAY DATA
        let selectSqlStatement = `select * from ${tableName}`;
        tx.executeSql(
          selectSqlStatement,
          null,
          (tx, result) => {
            console.log("*** SELECT DATA SUCCESS ***");
            if (result.rows.length <= 0) {
              console.log("No data is in the localStorage")
              resolve({ success: false })
            };
            resolve({ result: result, success: true });
          },
          (tx, err) => {
            console.log("*** SELECT DATA FAIL ***");
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
            console.log("*** INSERT DATA SUCCESS ***");
            resolve({ success: true });
          },

          (tx, err) => {
            console.log("*** INSERT DATA FAIL ***");
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
              console.log("*** SELECT DATA SUCCESS ***");
              console.log(result);
            },
            (tx, err) => {
              console.log("*** SELECT DATA FAIL ***");
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
