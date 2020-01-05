const express = require("express");
const router = express.Router();

router.use("/scrapes", require("./scrapes"));
router.use("/files", require("./files"));
router.use("/clients", require("./clients"));
router.use("/upload", require("./upload"));

module.exports = router;
