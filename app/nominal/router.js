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
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);

router.get("/", index);
router.get("/create", viewCreate);
router.get("/edit/:_id", viewEdit);
router.post("/create", actionCreate);
router.put("/edit/:_id", actionEdit);
router.delete("/delete/:_id", actionDelete);

module.exports = router;
