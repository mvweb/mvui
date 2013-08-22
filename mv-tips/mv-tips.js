!function ($) {

	"use strict";

	var Tip = function (el, options) {
		this._init(el, options);
	}

	Tip.DEFAULT = {
		placement: 'bottom',
		title: 'mv-tips:忘了写内容了？',
		template: '<div class="tip"><div class="tip-arrow"></div><div class="tip-inner"></div></div>',
		trigger: 'hover',
	};

	Tip.prototype = {

		constructor: Tip,

		_init: function (el, options) {
			var $el = $(el);
			this.element = el;
			this.options = $.extend({}, Tip.DEFAULT, $el.data(), options);
			el.title = '';
			this.tip = $(this.options.template);
			this.tip.find('.tip-inner')['text'](this.options.title);
			this.tip.detach()
					.css({ top: 0, left: 0, display: 'block' })
					.addClass(this.options.placement);
			this.onshow = false;

			var triggers = this.options.trigger.split(' '),
				trigger = '',
				that = this,
				eventIn,
				eventOut,
				i = triggers.length - 1;

			for (i; i >= 0; i--) {
				trigger = triggers[i];
				if (trigger == 'click') {
					$el.on('click.tip', function () {
						that.toggle.call(that);
					});
				} else {
					eventIn = trigger == 'hover' ? 'mouseenter' : 'focus';
					eventOut = trigger == 'hover' ? 'mouseleave' : 'blur';
					$el.on(eventIn + '.tip', function () {
						that.show.call(that);
					});
					$el.on(eventOut + '.tip', function () {
						that.hide.call(that);
					});
				}
			}
		},

		show: function () {
			var e = $.Event('show');
			$(this.element).trigger(e);
			if (e.isDefaultPrevented()) {return;}

			this.tip.insertAfter(this.element);
			this.setPos();
			this.onshow = true;

			$(this.element).trigger('shown');
		},

		hide: function () {
			var e = $.Event('hide');
			$(this.element).trigger(e);
			if (e.isDefaultPrevented()) {return;}

			this.tip.detach();
			this.onshow = false;

			$(this.element).trigger('hidden');
		},

		toggle: function () {
			this.onshow ? this.hide() : this.show();
		},

		destroy: function () {
			this.tip.remove();
			$(this.element).off('.tip').removeData('mv.tip');
		},

		setPos: function (pos) {
			var $el = $(this.element),
				top = $el.position().top,
				left = $el.position().left,
				width = $el.width(),
				height = $el.height(),
				tipWidth = this.tip[0].offsetWidth,
				tipHeight = this.tip[0].offsetHeight,
				placement = pos ? 'setted' : this.options.placement,
				tipPos = {};

			switch (placement) {
				case 'bottom':
				tipPos = {top: top + height, left: left + width / 2 - tipWidth / 2};
				break;
				case 'top':
				tipPos = {top: top - tipHeight, left: left + width / 2 - tipWidth / 2};
				break;
				case 'left':
				tipPos = {top: top + height / 2 - tipHeight / 2, left: left - tipWidth - 5};
				break;
				case 'right':
				tipPos = {top: top + height / 2 - tipHeight / 2, left: left + width};
				break;
				case 'setted':
				tipPos = pos;
				break;
			}
			this.tip.css(tipPos);
		}
	};


	var old = $.fn.tooltip;

	$.fn.tip = function (option,argu) {
		return this.each(function () {
			var $this = $(this),
			data = $this.data('mv.tip'),
			options = typeof option == 'object' && option;

			if (!data) {
				$this.data('mv.tip', (data = new Tip(this, options)));
			}

			if (typeof option == 'string') {
				data[option](argu);
			}
		})
	}

	$.fn.tip.Constructor = Tip;

	$.fn.tip.noConflict = function () {
		$.fn.tip = old;
		return this;
	}

	$(function () {
		$('[data-toggle="mv-tips"]').tip();
	})

}(window.jQuery);