const express = require("express");
const Onboarding_Submit_Controller = require("./controller/onboarding_Submit_Controller.js");
const Onboarding_Query_Controller = require("./controller/onboarding_Query_Controller.js");
const router = express.Router();

//=========================
// onboarding Submit Route
//=========================
router.post("/createAccountSubmit", Onboarding_Submit_Controller.createAccountSubmit);
router.post("/aboutYouSubmit", Onboarding_Submit_Controller.aboutYouSubmit);
router.post("/preferencesSubmit", Onboarding_Submit_Controller.preferencesSubmit);
router.post("/interestsSubmit", Onboarding_Submit_Controller.interestsSubmit);
router.post("/wouldyouRatherSubmit", Onboarding_Submit_Controller.wouldyouRatherSubmit);
router.post("/localDestinationsSubmit", Onboarding_Submit_Controller.localDestinationsSubmit);

//=========================
// onboarding Query Route
//=========================
router.post("/userProfileSingleCollectionQuery", Onboarding_Query_Controller.userProfileSingleCollectionQuery);
router.post("/userProfileAllCollectionsQuery", Onboarding_Query_Controller.userProfileAllCollectionsQuery);


module.exports = router;
