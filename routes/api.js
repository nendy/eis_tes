/* GET users listing. */

module.exports = function(router){
	router.get('/', function(req, res) {
		res.send('Wellcome to API');
	});
};
