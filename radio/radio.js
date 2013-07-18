!function ($) {
	var tpl = '\
		{{#radios}}\
		<div id="radio-{{id}}" class="radio {{#checked}}active{{/checked}}">{{&label}}</div>\
		{{/radios}}\
		<div class="radio-hidden" style="display:1none"></div>'

	// var model = new Backbone.Model({
	// 	checked: 'id',
	// 	name: '',
	// 	html:'',
	// 	radios: [{id:1,name:"asdf",value:"asbd",label:"stu", checked:true}]
	// });
	var RadioGroup = Backbone.View.extend({
		events: {
			'click .radio' : 'clickRadio',
			'click input[type="radio"]' : '_clickRadio'
		},
		initialize: function () {
			this.model.on('change:checked', function (model) {
				var id = model.get('checked');
				$('#' + id).attr('checked', true);
				$(this.el).find('.active').removeClass('active');
				$(this.el).find('#radio-' + id).addClass('active');
			}, this);
			$(this.el).addClass('radio-group');
			this.render();			
		},
		render: function () {
			frag = document.createDocumentFragment();
			var hiddenRadioDiv = $(this.el).find(".radio-hidden");
			var parent = hiddenRadioDiv[0] ? hiddenRadioDiv : $(this.el);
			parent.children().each(function () {
				frag.appendChild(this);	
			});

	        $(this.el).html(Mustache.render(tpl, this.model.toJSON()));

	        $(this.el).find(".radio-hidden").append(frag);
	        return this;
		},
		clickRadio : function (evt) {
			var id = evt.target.id.split('-')[1]
			$('#' + id).trigger('click');
			$('#' + id).trigger('change');
		},

		_clickRadio :function (evt) {
			var id = evt.target.id;
			this.model.set("checked", id);
		}
	});

	function init (model) {
		var el = $('input[name=' + model.name + ']').parent().parent();
		return new RadioGroup({
			model : new Backbone.Model(model),
			el : el
		});
	}

	$.fn.radio = function (opt) {
		var radioGroupMap = {}, radioGroupArray = [];

		this.each(function () {
			var el = $(this), radio = {}, radioGroup = radioGroupMap[el.attr('name')] || {}, data = el.data('radio');

		    if (data) {
		    	console.log(data);
		    	radioGroupArray.push(data);
		    	return;
		    }

			radioGroup.radios || (radioGroup.radios = []);
			radioGroup.name = el.attr('name');
			radio.name = el.attr('name');
			radio.id = el.attr('id') || _.uniqueId('radio');
			el.attr('id') || el.attr('id', radio.id);
			radio.value = el.attr('value');
			radio.label = el.parent().text();
			radio.checked = !!el.attr('checked');
			radio.checked && (radioGroup.checked = radio.id);
			radioGroup.radios.push(radio);
			radioGroupMap[radio.name] = radioGroup;
		});

		for (var key in radioGroupMap) {
			var radioGroup = init(radioGroupMap[key]);
			radioGroupArray.push(radioGroup);
			radioGroupMap[key] = radioGroup;
		}

		radioGroupArray = _.uniq(radioGroupArray);

		if (typeof opt == 'string') {
			_.each(radioGroupArray, function(radio) {
				radio[option]();
			});
		
		}
		return this.each(function() {
			var el = $(this), radio = {}, radioGroup = radioGroupMap[el.attr('name')], data = el.data('radio');
			if (!data) {
				el.data("radio", radioGroup);
			}
		})
		// window.radioGroupArray = radioGroupArray;
	};

	$(function () {
		$('.radio-group input').radio();
	})
	

}(window.jQuery);


//如果input没有id怎么办，index关联
//if (!data) {
//   $this.data('tab', (data = new Tab(this)));
// }

// if (typeof option == 'string') {
//   data[option]();
// }




//tab
//组件自己的行为，用新属性配置:mv-provider

//提供事件$().on('switch', function (arg) {}); $.trigger(new $.Event('switch'));
//drag
