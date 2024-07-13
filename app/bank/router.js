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

router.get("/", index);
router.get("/create", viewCreate);
router.get("/edit/:_id", viewEdit);
router.put("/edit/:_id", actionEdit);
router.delete("/delete/:_id", actionDelete);
router.post("/create", actionCreate);

module.exports = router;
