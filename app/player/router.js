const express = require("express");
const { landingPage, detailPage, category } = require("./controller");
const router = express.Router();

router.get("/landing-page", landingPage);
router.get("/:_id/detail", detailPage);
router.get("/category", category);

module.exports = router;
