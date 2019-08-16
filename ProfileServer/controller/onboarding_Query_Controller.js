const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://Rex:oDDBydpkjOVfN7Ni@cluster0-pilnb.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "UsersProfile";
let database, collection;

//========================================
// createAccount Query Route
//========================================
exports.createAccountQuery = function(req, res) {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      //Access or Create Database
      database = client.db(DATABASE_NAME);

      //Query Data by Email
      let findByEmailPromise = () => {
        return new Promise((resolve, reject) => {
          database
            .collection("createAccount")
            .findOne({ email: req.body.email }, function(err, result) {
              err ? reject(err) : resolve(result);
            });
        });
      };

      let callfindByEmailPromise = async () => {
        var emailResult = await findByEmailPromise().catch(err =>
          console.log(err)
        );
        return emailResult;
      };

      callfindByEmailPromise().then(function(result) {
        res.json(result);
      });
    }
  );
  //(Step 1 above)
};
