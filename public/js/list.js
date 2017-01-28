var list={
	api_url:location.pathname+'api',
	qy:{start:0,limit:15},
	fm_dat:{},
	delete:function(){
		var id = $(this).attr('data');
		if(!confirm('Sure?'))return false;
		$.ajax({
			url: list.api_url+'/barang/'+id,
			type: 'DELETE',
			success: function(rsl) {
				if(rsl.stat != 1) return alert('Server said: '+rsl.mess);
				list.get();
			}
		});
	},
	clear_Fm:function(){
		document.addForm.reset();
		list.fm_dat={};
	},
	buildPage:function(total, jml){
		var st=list.qy.start -(-1);
		var sp=list.qy.start -(-jml);
		var limit=list.qy.limit;
		if(sp < total) $('#next_page_btn').parent().removeClass('disabled');
		else $('#next_page_btn').parent().addClass('disabled');
		if(st > 1) $('#prev_page_btn').parent().removeClass('disabled');
		else $('#prev_page_btn').parent().addClass('disabled');
		$('#total_vw').text(total);
		$('#range_vw').html(st +' &mdash; '+sp);
	},
	fill:function(arr){
		//console.log(arr);
		$('#list_result').append(
			$(document.createElement('tr'))
				.append($(document.createElement('td'))
					.append($(document.createElement('input')).attr({type:'checkbox'}))
				)
				.append($(document.createElement('td')).text(arr.id))
				.append($(document.createElement('td')).text(arr.nama))
				.append($(document.createElement('td')).text(arr.value))
				.append($(document.createElement('td')).text(arr.created_at))
				.append($(document.createElement('td'))
					.append($(document.createElement('i')).attr({title:'Edit','class':'fa fa-edit',data:arr.id}).click(list.edit))
					.append(' | ')
					.append($(document.createElement('i')).attr({title:'Delete','class':'fa fa-trash-o',data:arr.id}).click(list.delete))
				)
			);
	},
	edit:function(){
		var id = $(this).attr('data');
		list.clear_Fm();
		$.get(list.api_url+'/barang/'+id, function(arr){
			console.log('detail: ', arr);
			if(arr.stat != 1) return alert('server said: '+arr.mess);
			for(var i in arr.data){
				$('input[name='+i+']').val(arr.data[i]);
			}
			list.id_edited=id;
			$('#addForm').slideDown().addClass('editFm');
		},'json');
	},
	update:function(){
		if(Object.keys(list.fm_dat).length==0)alert('nothing to update');
		else $.ajax({
			url: list.api_url+'/barang/'+list.id_edited,
			type: 'PUT',
			data:$.param(list.fm_dat),
			//dataType:'json',
			success: function(rsl) {
				if(rsl.stat != 1) return alert('Server said: '+rsl.mess);
				list.clear_Fm();
				list.get();
			}
		});
	},
	save:function(){
		if(!list.fm_dat.nama)alert('Name can\'t be empty');
		else if(!list.fm_dat.value)alert('value can\'t be empty');
		else $.post(list.api_url+'/barang',$.param(list.fm_dat), function(arr){
			console.log('succes: ', arr);
			if(arr.stat != 1) return alert('Fail to save data');
			list.get();
			list.clear_Fm();
		},'json');
	},
	get:function(){
		$("#list_result").html('<tr><td clspan="5"><i class="fa fa-spinner fa-pulse"></i></td></tr>');
		$.get(list.api_url+'/barang',$.param(list.qy), function(arr){
			//console.log('succes: ', arr);
			if(arr.stat != 1) return $("#list_result").html('<tr><td clspan="5">Server said: '+arr.mess+'</td></tr>');
			if(arr.total==0) return $("#list_result").html('<tr><td clspan="5">Data tidak ditemukan</td></tr>');
			$("#list_result").empty();
			arr.data.forEach(list.fill);
			list.buildPage(arr.total,arr.data.length);
		},'json');
	}
}
$(function(){
	$('#limit_inp').change(function(){
		if(isNaN(this.value)) this.value=15;
		list.qy.limit=this.value;
		list.get();
	});
	$('#next_page_btn').click(function(){
		if($(this).parent().hasClass("disabled"))return false;
		list.qy.start+=list.qy.limit;
		list.get();
	});
	$('#prev_page_btn').click(function(){
		if($(this).parent().hasClass("disabled"))return false;
		list.qy.start-=list.qy.limit;
		list.get();
	});
	$('#addForm').slideUp();
	$('#add_btn').click(function(){
		$('#addForm').slideToggle().removeClass('editFm');
		list.clear_Fm();
	});
	$('#reset_btn').click(function(){
		$('#addForm').slideUp();
		list.clear_Fm();
	});
	$('#save_btn').click(list.save);
	$('#updt_btn').click(list.update);

	//sometime pure javascript is more easier :D
	var FORM = document.addForm;
	for(var i=0; i < FORM.elements.length; i++){
		var e = FORM.elements[i];
		if(e.name)e.onchange=function(){
			list.fm_dat[this.name]=this.value;
		};
	}

	list.get();
});