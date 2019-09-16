var MongoClient = require('mongodb').MongoClient;
var config = require("../config/main");
var path = require("path");
var fs = require("fs-extra");
var dBconfig = require("./../cache/dBconfig");

  createCache = async function(){
      try{
        MongoClient.connect(config.dbEndpoint, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
          console.log("cleanSlateProtocol complete");
          if (err) throw err;
          const db = client.db(config.dataBase);
          db.collection(config.collection).find({}).toArray(function(err, client) {
            if (err) throw err;
            var arr = client[0];
            const dl = JSON.stringify(arr);
            //the path must be made as if you were running in root directory
            var dBwriter = fs.createWriteStream('./cache/dBconfig.json');
            dBwriter.write(dl);
            console.log("dBconfig cache built")
      });
    });
  } catch (error){
    console.error(error);
  }
};

  cleanSlateProtocol = async function(){
      try{
        //the path must be made as if you were running in root directory
        await fs.unlink('./cache/dBconfig.json');
        console.info("dBconfig cache deleted");
      } catch (error){
        console.error(error);
        return;
      }
    };

    clearCache = async function (){
      try{
        await fs.unlink('./cache/output.json');
        console.info("Output cache deleted");
      } catch (error){
        console.error(error);
      }
    };

module.exports.cleanSlateProtocol = cleanSlateProtocol;
module.exports.createCache = createCache;
module.exports.clearCache = clearCache;