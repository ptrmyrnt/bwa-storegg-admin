const express = require("express");
const { viewLogin, actionLogin, actionLogout } = require("./controller");
const router = express.Router();

router.get("/", viewLogin);
router.post("/", actionLogin);
router.get("/logout", actionLogout);

module.exports = router;
