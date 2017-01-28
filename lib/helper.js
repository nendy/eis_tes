module.exports = function(req, res, next) {
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','x-auth, Origin, X-Requested-With, Content-Type, Accept, Cookie, Content-Length');
	res.with= function(cod, msg){
		if(cod==500){
			res.json({stat:3, msg:'Couldn\'t respon your request, try again later'});
			console.log('err:',msg);
		}
		else res.json({stat:cod,msg:msg});
	};
	var now = function(){
		var d = new Date();
		return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.toLocaleTimeString();
	}
	var ip = req.headers['x-forwarded-for']||req.connection.remoteAddress||req.socket.remoteAddress||req.connection.socket.remoteAddress;
	var org = req.get('origin') ? req.get('origin').split('//').pop():'-';

	req.log_stamp = function(){
		console.log(now()+' API request:', req.method, req.url);
		console.log(org, ip)
	}

	next();
};