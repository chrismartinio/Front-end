const uuidv5 = require("uuid/v5");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://Rex:oDDBydpkjOVfN7Ni@cluster0-pilnb.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "UsersProfile";
let database, collection;

//========================================
// createAccount Submit Route
//========================================
exports.createAccountSubmit = function(req, res) {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      //Access or Create Database
      database = client.db(DATABASE_NAME);

      //Step 1 : find if email exist in database
      //Step 2 : create an account (insert email/password) and return a GUI (ObjectId)
      //Step 3 : create a column in other collections based on that ObjectId

      //Find Duplicate email (Step 1 below)
      let findEmailPromise = () => {
        return new Promise((resolve, reject) => {
          database
            .collection("createAccount")
            .find({ email: req.body.email })
            .toArray(function(err, result) {
              err ? reject(err) : resolve(result);
            });
        });
      };

      let callFindEmailPromise = async () => {
        var emailResult = await findEmailPromise().catch(err =>
          console.log(err)
        );
        return emailResult;
      };

      callFindEmailPromise().then(function(result) {
        //if we find there a email exist, return false to client
        if (result.length != 0) {
          res.json({ success: false });
          res.end();
        } else {
          //Create a account on database and return the GUI (Step 2 Below)
          //createAccount Data
          let createAccountData = {
            email: req.body.email,
            password: req.body.password
          };
          let createAccountPromise = () => {
            return new Promise((resolve, reject) => {
              database
                .collection("createAccount")
                .insertOne(createAccountData, function(err, docsInserted) {
                  if (err) throw err;
                  resolve(docsInserted.ops[0]._id);
                });
            });
          };

          let callcreateAccountPromise = async () => {
            var gui = await createAccountPromise().catch(err =>
              console.log(err)
            );
            return gui;
          };

          callcreateAccountPromise().then(function(gui) {
            //create a column in other collection based on that GUI (Step 3 Below)
            //AboutYou data
            var aboutYouData = {
              _id: gui,
              birthDate: "",
              gender: "",
              country: "",
              firstName: "",
              lastName: "",
              zipCode: ""
            };

            //Access or Create Collection
            collection = database.collection("aboutYou");
            database
              .collection("aboutYou")
              .insertOne(aboutYouData, function(err) {
                if (err) throw err;
              });

            //Preferences data
            var preferencesData = {
              _id: gui,
              ageRange: "",
              distanceRange: "",
              interestedGender: ""
            };

            //Access or Create Collection
            collection = database.collection("preferences");
            database
              .collection("preferences")
              .insertOne(preferencesData, function(err) {
                if (err) throw err;
              });

            //interests data
            var interestsData = {
              _id: gui,
              likesArray: ""
            };

            //Access or Create Collection
            collection = database.collection("interests");
            database
              .collection("interests")
              .insertOne(interestsData, function(err) {
                if (err) throw err;
              });

            //wouldYouRather data
            var wouldYouRatherData = {
              _id: gui,
              s1r1: "",
              s1r2: "",
              s2r1: "",
              s2r2: "",
              s3r1: "",
              s3r2: ""
            };

            //Access or Create Collection
            collection = database.collection("wouldYouRather");
            database
              .collection("wouldYouRather")
              .insertOne(wouldYouRatherData, function(err) {
                if (err) throw err;
              });

            //localDestinations data
            var localDestinationsData = {
              _id: gui,
              weekendLocation: ""
            };

            //Access or Create Collection
            collection = database.collection("localDestinations");
            database
              .collection("localDestinations")
              .insertOne(localDestinationsData, function(err) {
                if (err) throw err;
              });
            //(Step 3 Above)
            client.close();
            res.json({ success: true, hashID: gui });
          });
        }
        //res.send({ success: true, hashID: 123 });
      });
    }
  );
  //(Step 1 above)
};
