const express = require("express");
const { register } = require("./controller");
const router = express.Router();
const multer = require("multer");
const os = require("os");

router.post(
  "/register",
  multer({ dest: os.tmpdir() }).single("avatar"),
  register
);

module.exports = router;
