/*
 * mv grid lib
 * @author wanghch@mediav.com
 * @date 2013-07-08
 */

!(function($){
	"use strict";	
	var Table = function(element,options){
		this._items = [];
		this._pagination = {};
		this.$element = $(element);
   		this.options = $.extend({}, $.fn.table.defaults, options);
   		this._renderHeader(this.options.labels);
   		this.$element.addClass('table table-bordered');
   		this._init();
   		this._listen();
   		this.fetch();   		
	};
	Table.prototype = {	
		_init:function(){
			this.options.params = $.extend({},this.options.params,this.options.pagination.config);
		},
		_renderHeader:function(labels){
			var t = [];
			for(var k in labels){
				var label = labels[k],labelStr = '';
				
				if(typeof label == 'string'){
					labelStr = label;	
				}else if(typeof label == 'object' && label.value){
					labelStr = label.value;	
				}else if(typeof label == 'function'){
					labelStr = label(k);
				}
				if(this.options.models[k].sort){
					t.push('<th class="'+this.options.sort.bothClass+'">'+labelStr+'</th>');
				}else{
					t.push('<th>'+labelStr+'</th>');
				}
				
			}
			var thead = this.$element.find('thead');
			if(thead.length > 0){
				thead.html(t.join(''));
			}else{
				thead = $('<thead></thead>').html(t.join(''));
				this.$element.prepend(thead);
			}
		},
		_renderBody:function(data,models,labels){
			var bodyTemArr = [];
			for(var k in data){
				var item = data[k];
				bodyTemArr.push('<tr>');
				for(var i = 0,length = labels.length ; i <length; i++){
					var model = models[i];
					var modelValue,modelAttr = '';
					if(typeof model == 'string'){
						modelValue = item[model];
						modelAttr = model;
					}else if(typeof model == 'object' && model.name){
						modelAttr = model.name;
						modelValue = item[model.name];
						if(!modelValue && model.emptyText){
							modelValue = model.emptyText;
						}
					}else if(typeof model == 'function'){
						modelValue = model(k,item);
					}else{
						modelValue = this.options.emptyText;
					}

					bodyTemArr.push('<td mv-data-attr="'+modelAttr+'">'+modelValue+'</td>');
					
				}
				bodyTemArr.push('</tr>');
			}

			var tbody = this.$element.find('tbody');
			var bodyStr = bodyTemArr.join('');
			if(tbody.length > 0){
				tbody.html(bodyStr);
			}else{
				tbody = $('<tbody></tbody>').html(bodyStr);
				this.$element.append(tbody);
			}
		},
		_renderFooter:function(pagination){
			if(this.options.pagination){				
				var footStr;
				if(typeof pagination.render == 'function'){
					footStr = pagination.render(pagination);
				}else{
					var pageTmpArr = [];

					pageTmpArr.push('<div class="pagination"><ul>');
					if(pagination.prev){
						pageTmpArr.push('<li><a page="'+pagination.prev+'" href="#">prev</a></li>');	
					}

					if(pagination.next){
						pageTmpArr.push('<li><a page="'+pagination.next+'" href="#">next</a></li>');	
					}
					pageTmpArr.push('<li>'+pagination.current+'/'+pagination.pages+' total:'+pagination.total+'</li>');
					pageTmpArr.push('</ul></div>');	
					footStr = pageTmpArr.join('');		
				}
				if(footStr){
					var spanNum = this.options.labels.length; 
					var foot = this.$element.find('tfoot');
					footStr = '<td  align=right colspan="'+spanNum+'">'+footStr+'</td>';
					if(foot.length > 0){
						foot.html(footStr);
					}else{
						foot = $('<tfoot></tfoot>').html(footStr);
						this.$element.append(foot);
					}
					$('.pagination a').on('click.mediav-api',this, Table.prototype.changePage);
				}	
			}
		},
		position:function(row,col,data){
			if(this._items[row]){
				this._items[row][col] = data;
				$('tbody').find('tr').eq(row).find('[mv-data-attr='+col+']').html(data);
			}
		},
		render:function(){
			this._renderHeader();
			this._renderBody(this._items,this.options.models,this.options.labels);
			this._renderFooter(this._pagination);
		},
		changePage:function(e){
			var $this = $(this),page = $this.attr('page'),t = e.data;;
			t.options.params.page = page;
			t.fetch();
		},
		changeSort:function(e){
			var $this = $(this);
			var t = e.data;
			
			var index = $this.parent().children().index($this);
			var name = t.options.models[index].name;
			var sortType = 'asc';
			var sortClass;
			switch($(this).attr('class')){
				case t.options.sort.ascClass:
					sortType = 'desc';
					sortClass = t.options.sort.descClass;
					break;
				case t.options.sort.descClass:
					sortClass = t.options.sort.ascClass;
					sortType = 'asc';
					break;
				case t.options.sort.bothClass:
					sortClass = t.options.sort.ascClass;
					break;
			}
			t.options.params.page = 1;
			t.options.params.sort = name + '.' + sortType;
			$this.attr('class',sortClass);
			t.fetch();
		},
		_listen:function(){
			var sortClass = [];
			for(var k in this.options.sort){
				sortClass.push('.'+this.options.sort[k]);
			}
			$(document).on('click.mediav-api', sortClass.join(','),this, Table.prototype.changeSort);
		},
		search:function(word){
			if(word){
				this.options.params.search = word;		
			}else{
				delete this.options.params.search;
			}
			this.fetch();
		},
		fetch:function(){	
			
			if(this.options.url){
				var $this = this;
				if(this.options.beforeRequest){
					this.options.beforeRequest();
				}
				$.ajax({
					'url':this.options.url,
					type:'POST',
					data:this.options.params,
					dataType:this.options.dataType,
					success:function(data){
						if(data.status == 0){
							$this._items = data.data.items;
							$this._pagination = data.data.pagination;
							$this._renderBody(data.data.items,$this.options.models,$this.options.labels);						

							if($this.options.hasFooter){
								$this._renderFooter(data.data.pagination);
							}
							if($this.options.afterSuccess){
								$this.options.afterSuccess(data.data);
							}	
						}
						
					}
				});
				if(this.options.afterRequest){
						this.options.afterRequest();
				}

			}
		}
	} 


	var old = $.fn.table;
	$.fn.table = function(option,params){
		 return this.each(function () {	 
	      var $this = $(this)
	        , data = $this.data('table')
	        , options = typeof option == 'object' && option;

	      if (!data) {
	      		$this.data('table', (data = new Table(this, options)));
	      }
	      if (typeof option == 'string') {
	      	data[option](params);
	      }
	    });
	}

	$.fn.table.noConflict = function () {
    	$.fn.table = old;
    	return this;
  	}

  	$.fn.table.defaults = {
  		dataType:'json',
  		url:false,
  		params:{},
  		sort:{
  			'ascClass':'mvtable-sort_asc',
  			'descClass':'mvtable-sort_desc',
  			'bothClass':'mvtable-sort_both'
  		},
  		hasFooter:true,
  		pagination:{
  			config:{
  				page:1,
  				pagesize:10,
  			},
  			render:false
  		},
  		beforeRequest:false,
  		afterRequest:false,
  		labels:false,
  		models:false,
  		emptyText:'&nbsp;'
  	};

})(window.jQuery);