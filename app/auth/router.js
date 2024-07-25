const express = require("express");
const { register, login } = require("./controller");
const router = express.Router();
const multer = require("multer");
const os = require("os");

router.post(
  "/register",
  multer({ dest: os.tmpdir() }).single("avatar"),
  register
);
router.post("/login", login);

module.exports = router;
