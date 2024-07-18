const express = require("express");
const { landingPage, detailPage } = require("./controller");
const router = express.Router();

router.get("/landing-page", landingPage);
router.get("/:_id/detail", detailPage);

module.exports = router;
