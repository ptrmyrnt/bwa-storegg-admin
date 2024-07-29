const express = require("express");
const {
  landingPage,
  detailPage,
  category,
  checkout,
  history,
  historyDetail,
} = require("./controller");
const { isLoginPlayer } = require("../middleware/auth");
const router = express.Router();

router.get("/landing-page", landingPage);
router.get("/:_id/detail", detailPage);
router.get("/category", category);
router.post("/checkout", isLoginPlayer, checkout);
router.get("/history", isLoginPlayer, history);
router.get("/history/:_id/detail", isLoginPlayer, historyDetail);

module.exports = router;
