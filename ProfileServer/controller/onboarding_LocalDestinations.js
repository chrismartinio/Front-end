const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://Rex:oDDBydpkjOVfN7Ni@cluster0-pilnb.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "UsersProfile";
let database, collection;

//========================================
// LocalDestinations Submit Route
//========================================
exports.localDestinationsSubmit = function(req, res) {
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
      //Access or Create Collection
      collection = database.collection("localDestinations");
      var target = { _id: req.body.hashID };
      var updateData = {
        $set: {
          weekendLocation: req.body.weekendLocation
        }
      };
      //Find the first document in the customers collection:
      database
        .collection("localDestinations")
        .updateOne(target, updateData, function(err, res) {
          if (err) throw err;
          console.log("1 localDestinations Data updated");
          client.close();
        });
      //console.log("Connected to `" + DATABASE_NAME + "`!");
    }
  );
};
