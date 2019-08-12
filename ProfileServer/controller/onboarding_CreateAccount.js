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
  //hash the email to an id on database
  let hashID = uuidv5(req.body.email, uuidv5.URL);

  let myPromise = () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        (error, client) => {
          if (error) {
            throw error;
          }
          //Access or Create Database
          database = client.db(DATABASE_NAME);

          //createAccount Data
          var createAccountData = {
            _id: hashID,
            email: req.body.email,
            password: req.body.password
          };

          //Access or Create Collection
          collection = database.collection("createAccount");
          database
            .collection("createAccount")
            .insertOne(createAccountData, function(err) {
              //make a promise to wait for all database

              if (err) {
                client.close();
                res.send({ success: false, hashID: "duplicate" });
              }

              client.close();
            });

          //AboutYou data
          var aboutYouData = {
            _id: hashID,
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
              if (err) {
                client.close();
                res.end();
              }
              client.close();
            });

          //Preferences data
          var preferencesData = {
            _id: hashID,
            ageRange: "",
            distanceRange: "",
            interestedGender: ""
          };

          //Access or Create Collection
          collection = database.collection("preferences");
          database
            .collection("preferences")
            .insertOne(preferencesData, function(err) {
              if (err) {
                client.close();
                res.end();
              }
              client.close();
            });

          //interests data
          var interestsData = {
            _id: hashID,
            likesArray: ""
          };

          //Access or Create Collection
          collection = database.collection("interests");
          database
            .collection("interests")
            .insertOne(interestsData, function(err) {
              if (err) {
                client.close();
                res.end();
              }
              client.close();
            });

          //wouldYouRather data
          var wouldYouRatherData = {
            _id: hashID,
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
              if (err) {
                client.close();
                res.end();
              }
              client.close();
            });

          //localDestinations data
          var localDestinationsData = {
            _id: hashID,
            weekendLocation: ""
          };

          //Access or Create Collection
          collection = database.collection("localDestinations");
          database
            .collection("localDestinations")
            .insertOne(localDestinationsData, function(err) {
              if (err) {
                client.close();
                res.end();
              }
              client.close();
            });
        }
      );
    });
  };

  var callMyPromise = async () => {
    let result = await myPromise();
    return;
  };

  callMyPromise().then(function(result) {
    res.send({ success: true, hashID: hashID });
  });
};
