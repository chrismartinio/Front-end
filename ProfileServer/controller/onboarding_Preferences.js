const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://Rex:oDDBydpkjOVfN7Ni@cluster0-pilnb.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "UsersProfile";
let database, collection;

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
      collection = database.collection("preferences");
      var target = { '_id': ObjectId(req.body.gui) };
      var updateData = {
        $set: {
          ageRange: req.body.ageRange,
          distanceRange: req.body.distanceRange,
          interestedGender: req.body.interestedGender
        }
      };
      //Find the first document in the customers collection:
      database
        .collection("preferences")
        .updateOne(target, updateData, function(err, res) {
          if (err) throw err;

          client.close();
        });
    }
  );
  res.status(200).end();
};
