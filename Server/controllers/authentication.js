const jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
    User = require('../models/users'),
    config = require('../config/main');

function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 10080 // in seconds
    });
}

// Set user info from request
function setUserInfo(request) {
    console.log("request", request);
    return {
        _id: request._id,
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        dateOfBirth: request.dateOfBirth,
        profile: request.profile
    };
}
//========================================
// Login Route
//========================================
exports.login = function (req, res, next) {

    let userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
}


//========================================
// Registration Route
//========================================
exports.register = function (req, res, next) {
    // Check for registration errors
    console.log("body", req.body);
    const email = req.body.email;
    const dateOfBirth = req.body.dateOfBirth;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const country = req.body.country;
    const city = req.body.city;
    const username = req.body.username

    // Return error if no username provided
    if (!username) {
        return res.status(422).send({ error: 'You must enter a username.' })
    }
    // Return error if no email provided
    if (!email) {
        return res.status(422).send({ error: 'You must enter an email address.' });
    }

    // Return error if no password provided
    if (!password) {
        return res.status(422).send({ error: 'You must enter a password.' });
    }

    if (!dateOfBirth) {
        return res.status(422).send({ error: 'You must enter a date of birth.' });
    }

    User.findOne({ email: email }, function (err, existingEmail) {
        console.log("existingEmail", existingEmail)
        if (err) { return next(err); }
        // If email is not unique, return error
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
            console.log(dateOfBirth, firstName, lastName, country, city, username)
            let user = new User({
                username: username,
                password: password,

                profile: {
                    email: email,
                    firstname: firstName,
                    lastName: lastName,
                    dateOfBirth: dateOfBirth,
                    country: country,
                    city: city
                },
            });
            console.log('outside', user);
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