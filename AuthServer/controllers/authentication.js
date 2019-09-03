const jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    User = require('../models/users'),
    config = require('../config/main');
    var ObjectId = require('mongodb').ObjectID;
    bcrypt = require('bcrypt');

function generateToken(user) {

    return jwt.sign(user, config.secret, {
        expiresIn: 10080 // in seconds
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
// testing adding a person



exports.login = function (req, res, next) {
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


        const token = generateToken(user_id)
        return res.send({token: token, success: true})
  })


}


//========================================
// Registration Route
//========================================
exports.register = function (req, res, next) {
    // Check for registration errors

    // registration will need multiple handlers
    // need to handle range of having one data, or all data

        // Return error if no username provided
    if (!username) {
        return res.status(422).send({ error: 'You must enter a username.' })
    }
    // Return error if no email provided
    if (!email) {
        return res.status(422).send({ error: 'You must enter an email address.' });
    }

    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username

    const dateOfBirth = req.body.dateOfBirth;
    const country = req.body.country;
    //zip code over here
    const city = req.body.city;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    // Return error if no password provided
    if (!password) {
        return res.status(422).send({ error: 'You must enter a password.' });
    }

    if (!dateOfBirth) {
        return res.status(422).send({ error: 'You must enter a date of birth.' });
    }

    User.findOne({ email: email }, function (err, existingEmail) {
        if (err) { return next(err); }
        // If email is not unique, return error

        // do a check here for updating email
        if (existingEmail) {
            return res.status(422).send({ error: 'That email address is already in use.' });
        }

        User.findOne({ username: username }, function (err, existingUsername) {
            if (err) { return next(err); }

            //If username is not unique, return error

            if (existingUsername) {
                return res.status(422).send({
                    error: 'That username is already in use.'
                })
            }

            // If email and username is unique and password was provided, create account
            let user = new User({
                username: username,
                password: password,
                email: email,
                profile: {
                    firstname: firstName,
                    lastName: lastName,
                    dateOfBirth: dateOfBirth,
                    country: country,
                    city: city
                },
            });
            user.save(function (err, user) {
                if (err) { return next(err); }

                // Subscribe member to Mailchimp list
                // mailchimp.subscribeToNewsletter(user.email);

                // Respond with JWT if user was created

                let userInfo = setUserInfo(user);
                res.status(201).json({
                    token: 'JWT ' + generateToken(userInfo),
                    user: userInfo
                });
            });
        })
    });
}

//========================================
// Authorization Middleware
//========================================

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