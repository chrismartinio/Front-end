const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://Rex:oDDBydpkjOVfN7Ni@cluster0-pilnb.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "Profile_Service";
let database, collection;

const bcrypt = require('bcrypt');

//========================================
// Profile_Service usersProfile Collection Query Route
//========================================
//Parameter 1 - Email : used to find the user data in the database
//Parameter 2 - Password : used to secure user data

//User: Regualr / Third Parties / Undone

/*Process
  Step 1 : find the user data by email in the createAccount Colleciton and return that user gui
  Step 2 : check whether the user password is match to the database password
  Step 3 : use the user gui to find the user data from the collections
*/
exports.usersProfileQuery = function(req, res) {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      //Access or Create Database
      database = client.db(DATABASE_NAME);

      let createAccountPromise = () => {
        return new Promise((resolve, reject) => {
          database
            .collection("usersProfile")
            .findOne({ email: req.body.email }, function(err, result) {
              err ? reject(err) : resolve(result);
            });
        });
      };

      let callcreateAccountPromise = async () => {
        var emailResult = await createAccountPromise().catch(err =>
          console.log(err)
        );
        return emailResult;
      };

      callcreateAccountPromise().then(function(result) {
        if (result === null) {
          res.json({
            success: false,
            message: "The email does not exist"
          });
        } else if (!bcrypt.compareSync(req.body.password, result.password)) {
          res.json({
            success: false,
            message: "Password does not match"
          });
        } else {
          let gui = result._id;

          //collections Promise
          let collectionPromise = () => {
            return new Promise((resolve, reject) => {
              database
                .collection("usersProfile")
                .findOne({ _id: gui }, function(err, result) {
                  err ? reject(err) : resolve(result);
                });
            });
          };

          let callcollectionPromise = async () => {
            var result = await collectionPromise().catch(err =>
              console.log(err)
            );
            return result;
          };

          callcollectionPromise().then(function(result) {
            result.success = true;
            result.message = "Query Data Sucessfully";
            res.json(result);
          });
        }
      });
    }
  );
};
