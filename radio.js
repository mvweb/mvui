!function ($) {
	var tpl = '\
		{{#radios}}\
		<div id="radio-{{id}}" class="radio {{#checked}}active{{/checked}}">{{&label}}</div>\
		{{/radios}}\
		<div class="radio-hidden" style="display:">{{&html}}</div>'

	// var model = new Backbone.Model({
	// 	checked: 'id',
	// 	name: '',
	// 	html:'',
	// 	radios: [{id:1,name:"asdf",value:"asbd",label:"stu", checked:true}]
	// });
	var View = Backbone.View.extend({
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
		render: function (model) {
	        $(this.el).html(Mustache.render(tpl, this.model.toJSON()));
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
		model.html = el.html();
		var view = new View({
			model : new Backbone.Model(model),
			el : el
		});
		return view;
	}

	$.fn.radio = function (opt) {
		var radioGroupMap = {}, radioGroupArray = [];
		this.each(function () {
			var el = $(this), radio = {}, radioGroup = radioGroupMap[el.attr('name')] || {};

			if (el.parent().parent().hasClass('radio-hidden')) {
				return
			};			

			radioGroup.radios || (radioGroup.radios = []);
			radioGroup.name = el.attr('name');
			radio.name = el.attr('name');
			radio.id = el.attr('id');
			radio.value = el.attr('value');
			radio.label = el.parent().text();
			radio.checked = !!el.attr('checked');
			radio.checked && (radioGroup.checked = radio.id);
			radioGroup.radios.push(radio);
			radioGroupMap[radio.name] = radioGroup;
		});
		for (var key in radioGroupMap) {
			radioGroupArray.push(init(radioGroupMap[key]));
		}
		window.radioGroupArray = radioGroupArray;
		return radioGroupArray;
	};

	$(function () {
		$('.radio-group input').radio();
	})
	

}(window.jQuery);