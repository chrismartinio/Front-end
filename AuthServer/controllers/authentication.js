const jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    User = require('../models/users'),
    jwtConfig = require('../models/config'),
    config = require('../config/main');
    var ObjectId = require('mongodb').ObjectID;
    bcrypt = require('bcrypt');



function generateToken(user, payload) {

  // try{
  //   mongoose.connect(config.configDatabase, { useNewUrlParser: true }).then(
  //     (data)=>{
  //       jwtConfig.findOne({
  //         '_id':'5d7f04e41c9d440000efe60b'
  //       }, function(err, item) {
  //         console.log(item)
  //       });
  //     },
  //     (err)=>{
  //         console.log('Error connecting to the db',err)
  //     }
  //   )
  // } catch(error){
  //   console.log(error)
  // }
    //payload, private key, signOptions
    // let payload = {
    //   user:user
    // }
    // let signOptions = var signOptions = {
    //   issuer:  i,
    //   subject:  s,
    //   audience:  a,
    //   expiresIn:  "168m",
    //   algorithm:  "RS256"   // RSASSA [ "RS256", "RS384", "RS512" ]
    // };
    return jwt.sign({user:user}, config.secret, {
      expiresIn: 10080
    });


}

// Set user info from request
function setUserInfo(request) {
    return {
        _id: request._id,
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        dateOfBirth: request.dateOfBirth,
        profile: request.profile,
        username: request.username
    };
}

function setUserId(request){
    return {
        _id: request._id
    };
}

function setLogin(request){
  return {
    username: request.body.username,
    password: request.body.password
  }
}



//========================================
// Login Route
//========================================



// if they hit this; we assume no token exists in initial hit
exports.login = function (req, res, next) {

    try {
        let type = req.body.authType
        if(type === 'email'){
            let userInfo = setLogin(req)
            let user_id = setUserId(req)

            User.findOne({"email":userInfo.username}, function(err, user){
            if(err){
                console.log('err here')
                return next(err)
            }

            if(!user){
              return res.status(403).send({ error: 'User Not found.' })
            }

            if(!bcrypt.compareSync(req.body.password, user.password)){
               return res.status(403).send({ error: 'Wrong Password.' })
            }

            let token = generateToken(user_id)
            console.log(token)
            return res.send({token: token, success: true})

         })
        } else if(type === 'facebook'){



          //find fb email data on jwt-->
            // find data on site; if not found create one?

            // load data onto JWT
            // send back jwt


            let id = req.body.data.id
            let token = generateToken(id)
            console.log(id, token)
            return res.status(200).send({"token": token, "success": true})


        } else if(type === 'google'){

        }


    } catch(error){
      console.log(error)
    }

}




// Role authorization check
exports.roleAuthorization = function (role) {
    return function (req, res, next) {
        const user = req.user;

        User.findById(user._id, function (err, foundUser) {
            if (err) {
                res.status(422).json({ error: 'No user was found.' });
                return next(err);
            }

            // If user is found, check role.
            if (foundUser.role == role) {
                return next();
            }

            res.status(401).json({ error: 'You are not authorized to view this content.' });
            return next('Unauthorized');
        })
    }
}