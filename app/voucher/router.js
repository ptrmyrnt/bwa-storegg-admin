const express = require("express");
const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
  actionDelete,
} = require("./controller");
const router = express.Router();
const multer = require("multer");
const os = require("os");

router.get("/", index);
router.get("/create", viewCreate);
router.get("/edit/:_id", viewEdit);
router.post(
  "/create",
  multer({ dest: os.tmpdir() }).single("image"),
  actionCreate
);
router.put(
  "/edit/:_id",
  multer({ dest: os.tmpdir() }).single("image"),
  actionEdit
);
router.delete(
  "/delete/:_id",
  multer({ dest: os.tmpdir() }).single("image"),
  actionDelete
);

module.exports = router;
