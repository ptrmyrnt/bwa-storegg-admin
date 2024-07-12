var express = require("express");
const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
} = require("./controller");
var router = express.Router();

router.get("/", index);
router.get("/create", viewCreate);
router.get("/edit/:_id", viewEdit);
router.put("/edit/:_id", actionEdit);
router.post("/create", actionCreate);

module.exports = router;
