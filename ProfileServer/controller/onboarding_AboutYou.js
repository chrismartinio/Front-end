const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://Rex:oDDBydpkjOVfN7Ni@cluster0-pilnb.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "UsersProfile";
let database, collection;

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
      collection = database.collection("aboutYou");
      var target = { '_id': ObjectId(req.body.hashID) };
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
        .collection("aboutYou")
        .updateOne(target, updateData, function(err, res) {
          if (err) throw err;

          client.close();
        });
    }
  );
  res.status(200).end();
};
