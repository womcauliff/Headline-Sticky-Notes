var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
 res.render("home", {
 	title: "Headline Sticky Notes",
 	path: "/"
 });
});

module.exports = router;
