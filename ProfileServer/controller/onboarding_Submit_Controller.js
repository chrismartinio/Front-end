const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://Rex:oDDBydpkjOVfN7Ni@cluster0-pilnb.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "Profile_Service";
let database, collection;

//Hash Password
const bcrypt = require("bcrypt");

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

      //Find Duplicate email (Step 1 below)
      let findEmailPromise = () => {
        return new Promise((resolve, reject) => {
          database
            .collection("usersProfile")
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
        //Hash Password
        let hashPassword = bcrypt.hashSync(req.body.password, 10);

        //if we find there a email exist, return false to client
        if (result.length != 0) {
          res.json({ success: false });
          res.end();
        } else {
          //Create a account on database and return the GUI (Step 2 Below)
          //usersProfile Data
          let usersProfileData = {
            email: req.body.email,
            password: hashPassword,
            birthDate: "",
            gender: "",
            country: "",
            firstName: "",
            lastName: "",
            zipCode: "",
            ageRange: "",
            distanceRange: "",
            interestedGender: "",
            likesArray: "",
            s1r1: "",
            s1r2: "",
            s2r1: "",
            s2r2: "",
            s3r1: "",
            s3r2: "",
            weekendLocation: ""
          };
          let usersProfilePromise = () => {
            return new Promise((resolve, reject) => {
              database
                .collection("usersProfile")
                .insertOne(usersProfileData, function(err, docsInserted) {
                  //Return GUI
                  err ? reject(err) : resolve(docsInserted.ops[0]._id);
                });
            });
          };

          let callusersProfilePromise = async () => {
            var gui = await usersProfilePromise().catch(err =>
              console.log(err)
            );
            return gui;
          };

          callusersProfilePromise().then(function(gui) {
            client.close();
            res.json({ success: true, gui: gui });
          });
        }
      });
    }
  );
  //(Step 1 above)
};

//========================================
// AboutYou Submit Route
//========================================
exports.aboutYouSubmit = function(req, res) {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      //Access or Create Database
      database = client.db(DATABASE_NAME);
      //Access or Create Collection
      collection = database.collection("usersProfile");
      var target = { _id: ObjectId(req.body.gui) };
      var updateData = {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          birthDate: req.body.birthDate,
          gender: req.body.gender,
          country: req.body.country,
          zipCode: req.body.zipCode
        }
      };
      //Find the first document in the customers collection:
      database
        .collection("usersProfile")
        .updateOne(target, updateData, function(err, res) {
          if (err) throw err;
        });
      client.close();
    }
  );
  res.status(200).end();
};

//========================================
// Preferences Submit Route
//========================================
exports.preferencesSubmit = function(req, res) {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      //Access or Create Database
      database = client.db(DATABASE_NAME);
      //Access or Create Collection
      collection = database.collection("usersProfile");
      var target = { _id: ObjectId(req.body.gui) };
      var updateData = {
        $set: {
          ageRange: req.body.ageRange,
          distanceRange: req.body.distanceRange,
          interestedGender: req.body.interestedGender
        }
      };
      //Find the first document in the customers collection:
      database
        .collection("usersProfile")
        .updateOne(target, updateData, function(err, res) {
          if (err) throw err;
        });
      client.close();
    }
  );
  res.status(200).end();
};

//========================================
// Interests Submit Route
//========================================
exports.interestsSubmit = function(req, res) {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      //Access or Create Database
      database = client.db(DATABASE_NAME);
      //Access or Create Collection
      collection = database.collection("usersProfile");
      var target = { _id: ObjectId(req.body.gui) };
      var updateData = {
        $set: {
          likesArray: req.body.likesArray
        }
      };
      //Find the first document in the customers collection:
      database
        .collection("usersProfile")
        .updateOne(target, updateData, function(err, res) {
          if (err) throw err;
        });
      client.close();
    }
  );
  res.status(200).end();
};

//========================================
// WouldYouRather Submit Route
//========================================
exports.wouldyouRatherSubmit = function(req, res) {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      //Access or Create Database
      database = client.db(DATABASE_NAME);
      //Access or Create Collection
      collection = database.collection("usersProfile");
      var target = { _id: ObjectId(req.body.gui) };
      var updateData = {
        $set: {
          s1r1: req.body.s1r1,
          s1r2: req.body.s1r2,
          s2r1: req.body.s2r1,
          s2r2: req.body.s2r2,
          s3r1: req.body.s3r1,
          s3r2: req.body.s3r2
        }
      };
      //Find the first document in the customers collection:
      database
        .collection("usersProfile")
        .updateOne(target, updateData, function(err, res) {
          if (err) throw err;
        });
      client.close();
    }
  );
  res.status(200).end();
};

//========================================
// LocalDestinations Submit Route
//========================================
exports.localDestinationsSubmit = function(req, res) {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      //Access or Create Database
      database = client.db(DATABASE_NAME);
      //Access or Create Collection
      collection = database.collection("usersProfile");
      var target = { _id: ObjectId(req.body.gui) };
      var updateData = {
        $set: {
          weekendLocation: req.body.weekendLocation
        }
      };
      //Find the first document in the customers collection:
      database
        .collection("usersProfile")
        .updateOne(target, updateData, function(err, res) {
          if (err) throw err;
        });
      client.close();
    }
  );
  res.status(200).end();
};
