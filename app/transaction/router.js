const express = require("express");
const router = express.Router();
const { isLoginAdmin } = require("../middleware/auth");
const { index, actionStatus } = require("./controller");

router.use(isLoginAdmin);

router.get("/", index);
router.put("/status/:_id", actionStatus);

module.exports = router;
