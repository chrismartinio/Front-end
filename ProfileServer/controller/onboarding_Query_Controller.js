const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://Rex:oDDBydpkjOVfN7Ni@cluster0-pilnb.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "UsersProfile";
let database, collection;

//========================================
// UsersProfile Single Collection Query Route
//========================================
//Parameter 1 - Email : used to find the user data in the database
//Parameter 2 - Password : used to secure user data
//Parameter 3 - collectionName : used to query the requested Collection

/*Process
  Step 1 : find the user data by email in the createAccount Colleciton and return that user gui
  Step 2 : check whether the user password is match to the database password
  Step 3 : use the user gui to find the user data from the collections
*/
exports.userProfileSingleCollectionQuery = function(req, res) {
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
            .collection("createAccount")
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
        } else if (result.password !== req.body.password) {
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
                .collection(req.body.collectionName)
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

//========================================
// UsersProfile All Collection Query Route
//========================================
//Parameter 1 - Email : used to find the user data in the database
//Parameter 2 - Password : used to secure user data

/*Process
  Step 1 : find the user data by email in the createAccount Colleciton and return that user gui
  Step 2 : check whether the user password is match to the database password
  Step 3 : query all data from all collection and send them back to client as a big object
*/
exports.userProfileAllCollectionsQuery = function(req, res) {
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
            .collection("createAccount")
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
          res.end();
        } else if (result.password !== req.body.password) {
          res.json({
            success: false,
            message: "Password does not match"
          });
        } else {
          let gui = result._id;

          //aboutYou Promise
          let aboutYouPromise = () => {
            return new Promise((resolve, reject) => {
              database
                .collection("aboutYou")
                .findOne({ _id: gui }, function(err, result) {
                  err ? reject(err) : resolve(result);
                });
            });
          };

          //preferences Promise
          let preferencesPromise = () => {
            return new Promise((resolve, reject) => {
              database
                .collection("preferences")
                .findOne({ _id: gui }, function(err, result) {
                  err ? reject(err) : resolve(result);
                });
            });
          };

          //interests Promise
          let interestsPromise = () => {
            return new Promise((resolve, reject) => {
              database
                .collection("interests")
                .findOne({ _id: gui }, function(err, result) {
                  err ? reject(err) : resolve(result);
                });
            });
          };

          //wouldYouRather Promise
          let wouldYouRatherPromise = () => {
            return new Promise((resolve, reject) => {
              database
                .collection("wouldYouRather")
                .findOne({ _id: gui }, function(err, result) {
                  err ? reject(err) : resolve(result);
                });
            });
          };

          //localDestinations Promise
          let localDestinationsPromise = () => {
            return new Promise((resolve, reject) => {
              database
                .collection("localDestinations")
                .findOne({ _id: gui }, function(err, result) {
                  err ? reject(err) : resolve(result);
                });
            });
          };

          let callallCollectionsPromise = async () => {
            var aboutYouResult = await aboutYouPromise().catch(err =>
              console.log(err)
            );
            var preferencesResult = await preferencesPromise().catch(err =>
              console.log(err)
            );
            var interestsResult = await interestsPromise().catch(err =>
              console.log(err)
            );
            var wouldYouRatherResult = await wouldYouRatherPromise().catch(
              err => console.log(err)
            );
            var localDestinationsResult = await localDestinationsPromise().catch(
              err => console.log(err)
            );
            /*
          let allresult = [];
          allresult = allresult.concat(aboutYouResult)
            .concat(preferencesResult)
            .concat(interestsResult)
            .concat(wouldYouRatherResult)
            .concat(localDestinationsResult);
            */

            let createAccountPromise = result;

            let allresult = {
              createAccount: {
                gui: createAccountPromise._id,
                email: createAccountPromise.email,
                password: createAccountPromise.password
              },
              aboutYou: {
                birthdate: aboutYouResult.birthdate,
                country: aboutYouResult.country,
                firstName: aboutYouResult.firstName,
                gender: aboutYouResult.gender,
                lastName: aboutYouResult.lastName,
                zipCode: aboutYouResult.zipCode
              },
              preferences: {
                ageRange: preferencesResult.ageRange,
                distanceRange: preferencesResult.distanceRange,
                interestedGender: preferencesResult.interestedGender
              },
              interests: {
                likesArray: interestsResult.likesArray
              },
              wouldYouRather: {
                s1r1: wouldYouRatherResult.s1r1,
                s1r2: wouldYouRatherResult.s1r2,
                s2r1: wouldYouRatherResult.s2r1,
                s2r2: wouldYouRatherResult.s2r2,
                s3r1: wouldYouRatherResult.s3r1,
                s3r2: wouldYouRatherResult.s3r2
              },
              localDestinations: {
                weekendLocation: localDestinationsResult.weekendLocation
              }
            };

            return allresult;
          };

          callallCollectionsPromise().then(function(result) {
            result.success = true;
            result.message = "Query Data Sucessfully";
            res.json(result);
          });
        }
      });
    }
  );
};
