var cfg = {
	port : 3000,
	db_host : 'localhost',
	db_name : 'tes',
	db_user : 'app1',
	db_pass : 'pass1',
};
switch(process.env.NODE_ENV){
	case 'production':

	break;
	case 'node-local':
		cfg.port = 3003,
		cfg.db_user = 'user';
		cfg.db_pass = 'passwd';
	break;
}
module.exports = cfg;