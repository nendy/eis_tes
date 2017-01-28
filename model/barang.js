exports.add = function(par, fn) {
	sql_('INSERT INTO barang SET ?', [par], fn);
}

exports.list = function(par, fn) {
	var clause =[], values =[], order =[], order_val =[],
		limit = par.limit,
		start = par.start;

	var query1 = "SELECT COUNT(*) jml FROM barang",
		query2 = "SELECT id,nama,value,created_at FROM barang";
	if(clause.length > 0){
		query1+='WHERE '+clause.join(' AND ');
		query2+='WHERE '+clause.join(' AND ');
	}
	if(par.order)query2 += " ORDER BY "+par.order;
	else query2 += " ORDER BY id DESC";

	sql_(query1, values, function(e, r){
		if(e) return console.log('list get total:',e,query1,values) || fn(e);
		//console.log('query2:', query2, values);
		sql_(query2+" LIMIT ?,?", values.concat([start, limit]), function(e, rsl){
			if(e) return console.log('list get data:',e,query2,values) || fn(e);
			fn(null,{stat:1, total:r[0].jml, data:rsl});
		});
	});
};

exports.detail = function(par, fn){
	sql_("SELECT * FROM barang WHERE id=?", par, fn);
}

exports.update = function(par, fn){
	sql_("UPDATE barang SET ? WHERE id=?", [par.update, par.id],fn);
}

exports.delete = function(par, fn){
	sql_("DELETE FROM barang WHERE id=?", par, fn);
}
