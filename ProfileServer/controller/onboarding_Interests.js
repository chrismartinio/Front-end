const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://Rex:oDDBydpkjOVfN7Ni@cluster0-pilnb.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "UsersProfile";
let database, collection;

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
      collection = database.collection("interests");
      var target = { _id: req.body.hashID };
      var updateData = {
        $set: {
          likesArray: req.body.likesArray
        }
      };
      //Find the first document in the customers collection:
      database
        .collection("interests")
        .updateOne(target, updateData, function(err, res) {
          if (err) throw err;

          client.close();
        });
    }
  );
  res.status(200).end();
};
