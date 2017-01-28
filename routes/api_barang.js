var model = require('../model/barang');
module.exports = function(router) {

	router.route('/barang/:id').get(function(req, res) {
		req.checkParams('id', 'user_id is integer').isInt();
		var errors = req.validationErrors();
		if (errors) return res.status(400).json({stat:2,mess:'There have been validation errors',info:errors});
		model.detail(req.params.id, function(e, r){
			if(e) return res.with(500,e);
			else res.json({stat:1, data:r[0]});
		});
	}).put(function(req,res){
		req.checkParams('id', 'id is integer').notEmpty().isInt();

		var errors = req.validationErrors();
		if (errors) return res.status(400).json({stat:2,mess:'There have been validation errors',info:errors});
		var par = {
			update:{},
			id:req.params.id
		};
		if(req.body.nama)par.update.nama=req.body.nama;
		if(req.body.value)par.update.value=req.body.value;
		console.log('params:',par);

		if(Object.keys(par.update).length==0)res.with(2,'noting to update');
		model.update(par, function(e,r){
			if(e) return res.with(500,e);
			res.json({stat:1,msg:'Updating OK'});
		})
	}).delete(function(req,res){
		req.checkParams('id', 'id is integer').notEmpty().isInt();

		var errors = req.validationErrors();
		if (errors) return res.status(400).json({stat:2,mess:'There have been validation errors',info:errors});
		model.delete(req.params.id, function(e, r){
			if(e) return res.with(500,e);
			res.json({stat:1,msg:'Deleting OK'});
		});
	});
	router.route('/barang').get(function(req, res) {
		//input validation
		req.checkQuery('page', 'page is integer').optional().isInt();
		req.checkQuery('limit', 'limit is integer').optional().isInt();
		//sanitize input
		req.sanitizeQuery('start').toInt();
		req.sanitizeQuery('limit').toInt();
		var errors = req.validationErrors();
		if (errors) return res.json({stat:2,mess:'There have been validation errors',info:errors});
		var par = {};
		par.start=req.query.start ||0;
		par.limit=req.query.limit ||15;

		console.log('list query:',req.query);

		model.list(par, function(e, r){
			if(e) return res.with(500,e);
			res.json(r);
		});
	})
	.post(function(req, res){
		req.checkBody('nama', 'nama is mandatary').notEmpty();
		req.checkBody('value', 'value is mandatary').notEmpty();
		var params ={
			nama: req.body.nama,
			value: req.body.value
		}
		model.add(params, function(e,r){
			if(e) return res.with(500,e);
			res.json({stat:1,new_id:r.insertId});
		});
	});
}