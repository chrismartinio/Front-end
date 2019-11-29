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
            if (result.rows.length <= 0) reject({ success: false });
            resolve({ result: result, success: true });
          }
          /*
            //This will log the error, but will override the transaction error callback function
            (tx, err) => {
              console.log("*** SELECT DATA FAIL ***");
              console.log(err);
            }
            */
        );
      },
      //Transaction error
      (tx, err) => {
        console.log("Failed: Transaction closed.");
        resolve({ success: false });
      },
      //Transaction success
      () => {
        //Transaction (itself) success
        console.log("Successed: Transaction closed.");
      }
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
          }
          /*
          //This will log the error, but will override the transaction error callback function
          (tx, err) => {
            console.log("*** INSERT DATA FAIL ***");
            console.log(err);
          }
          */
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
            }
            /*
            //This will log the error, but will override the transaction error callback function
            (tx, err) => {
              console.log("*** SELECT DATA FAIL ***");
              console.log(err);
            }
            */
          );
        }
      },
      //Transaction error
      (tx, err) => {
        console.log("Failed: Transaction closed.");
        resolve({ success: false });
      },
      //Transaction success
      () => {
        //Transaction (itself) success
        console.log("Successed: Transaction closed.");
        resolve({ success: true });
      }
    );
  });
}
