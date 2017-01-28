var express = require('express'),
	fs = require("fs"),
	router = express.Router();

/* setup /api routing */
fs.readdir(__dirname, function (err, list) {
	if (err)console.log(err);
	list.forEach(function(file){
		var api = file.match("api_(.*).js");
		if(api){
			require('./'+api[0])(router);
			console.log('load modul API:',api[1]);
		}
	});
});

module.exports = function(app){
	app.get('/', function(req, res){
		res.render('index');
	});
	app.get('/template/:mod', function(req, res){
		res.render('template/'+req.params.mod);
	});
	app.use('/api', function(req, res, next){
		req.log_stamp();
		next();
	}, router);
};