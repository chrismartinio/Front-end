const express = require("express");
const Onboarding_CreateAccountController = require("./controller/onboarding_CreateAccount.js");
const Onboarding_AboutYouController = require("./controller/onboarding_AboutYou.js");
const Onboarding_PreferencesController = require("./controller/onboarding_Preferences.js");
const Onboarding_InterestsController = require("./controller/onboarding_Interests.js");
const Onboarding_WouldYouRatherController = require("./controller/onboarding_WouldYouRather.js");
const Onboarding_LocalDestinationsController = require("./controller/onboarding_LocalDestinations.js");

const router = express.Router();

//=========================
// onboarding CreateAccount Route
//=========================
router.post("/createAccountSubmit", Onboarding_CreateAccountController.createAccountSubmit);

//=========================
// onboarding AboutYou Route
//=========================
router.post("/aboutYouSubmit", Onboarding_AboutYouController.aboutYouSubmit);

//=========================
// onboarding Preferences Route
//=========================
router.post("/preferencesSubmit", Onboarding_PreferencesController.preferencesSubmit);

//=========================
// onboarding Interests Route
//=========================
router.post("/interestsSubmit", Onboarding_InterestsController.interestsSubmit);

//=========================
// onboarding WouldYouRather Route
//=========================
router.post("/wouldyouRatherSubmit", Onboarding_WouldYouRatherController.wouldyouRatherSubmit);

//=========================
// onboarding LocalDestinations Route
//=========================
router.post("/localDestinationsSubmit", Onboarding_LocalDestinationsController.localDestinationsSubmit);

module.exports = router;
