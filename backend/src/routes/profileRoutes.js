const express = require("express");
const { getProfile, createOrUpdateProfile } = require("../controllers/profileController.js");

const router = express.Router();

router.get("/:userId", getProfile);
router.put("/:userId", createOrUpdateProfile);

module.exports = router;