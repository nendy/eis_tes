var mysql = require('mysql');
var CFG = require('../config')
var QUERY_LOG = process.env.QUERY_LOG;
var mysql_pool = mysql.createPool({
	connectionLimit : 100,
	host : CFG.db_host,
	database : CFG.db_name,
	user : CFG.db_user,
	password : CFG.db_pass,
	dateStrings:true
});
module.exports.connect = function () {
	console.log('create mysql pool');
	global.sql_ = function (){
		var arg=arguments;
		mysql_pool.getConnection(function(e,conn){
			if(e)console.log('mysql error:',e);
			else{
				var act=conn.query.apply(conn,arg);
				if(QUERY_LOG)console.log('do_query:',act.sql);
				conn.release();
			}
		});
	};
};