var express = require('express');
var router = express.Router();

/*GET user listing*/

router.get('/', function(request, response) {
	response.render('index.ejs', {});
});

module.exports = router;