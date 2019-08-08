const express = require("express");
const OnboardingController = require("./controller/onboarding.js");

//=========================
// onboarding Routes
//=========================
const router = express.Router();
router.post("/createAccount", OnboardingController.createAccount);

module.exports = router;
