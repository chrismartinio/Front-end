const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://Rex:oDDBydpkjOVfN7Ni@cluster0-pilnb.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "UsersProfile";
let database, collection;

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
      collection = database.collection("wouldYouRather");
      var target = { '_id': ObjectId(req.body.gui) };
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
        .collection("wouldYouRather")
        .updateOne(target, updateData, function(err, res) {
          if (err) throw err;

          client.close();
        });
    }
  );
  res.status(200).end();
};
