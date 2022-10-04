const express = require("express");
const router = express.Router();
const controllerHomepage = require("../controllers/controllerHomepage");

router.post("/search", controllerHomepage.startSearch);

module.exports = router;
