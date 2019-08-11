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
  //console.log(req.body);
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
        _id: req.body.hashID,
        email: req.body.email,
        password: req.body.password
      };

      //Access or Create Collection
      collection = database.collection("createAccount");
      database
        .collection("createAccount")
        .insertOne(createAccountData, function(err, res) {
          if (err) throw err;
          console.log("Created a row in createAccount Collection ");
          client.close();
        });

      //AboutYou data
      var aboutYouData = {
        _id: req.body.hashID,
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
        .insertOne(aboutYouData, function(err, res) {
          if (err) throw err;
          console.log("Created a row in aboutYou Collection ");
          client.close();
        });

      //Preferences data
      var preferencesData = {
        _id: req.body.hashID,
        ageRange: "",
        distanceRange: "",
        interestedGender: ""
      };

      //Access or Create Collection
      collection = database.collection("preferences");
      database
        .collection("preferences")
        .insertOne(preferencesData, function(err, res) {
          if (err) throw err;
          console.log("Created a row in preferences Collection ");
          client.close();
        });

      //interests data
      var interestsData = {
        _id: req.body.hashID,
        likesArray: ""
      };

      //Access or Create Collection
      collection = database.collection("interests");
      database
        .collection("interests")
        .insertOne(interestsData, function(err, res) {
          if (err) throw err;
          console.log("Created a row in interests Collection ");
          client.close();
        });

      //wouldYouRather data
      var wouldYouRatherData = {
        _id: req.body.hashID,
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
        .insertOne(wouldYouRatherData, function(err, res) {
          if (err) throw err;
          console.log("Created a row in wouldYouRather Collection ");
          client.close();
        });

      //localDestinations data
      var localDestinationsData = {
        _id: req.body.hashID,
        weekendLocation: ""
      };

      //Access or Create Collection
      collection = database.collection("localDestinations");
      database
        .collection("localDestinations")
        .insertOne(localDestinationsData, function(err, res) {
          if (err) throw err;
          console.log("Created a row in localDestinations Collection ");
          client.close();
        });

      //console.log("Connected to `" + DATABASE_NAME + "`!");
    }
  );
};
