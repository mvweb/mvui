!function ($) {

  "use strict";

  function getId (ele) {
    var selector = ele.attr('href');
    return selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7,去掉#后面的空白字符
  }

 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element);
  }

  Tab.prototype = {

    constructor: Tab,
    
    show: function () {
      var $this = this.element,
          selector = getId($this);

      this.activate($this.parent('li'));
      this.activate($(selector));
    },

    activate: function (element, callback) {
      element.addClass('active').siblings('.active').removeClass("active");
    },

    hover: function () {
      var $this = this.element;
      var actived = $this.parent('li').siblings('.active');
      this.activate($(getId($this)));

      $this.one('mouseleave', function () {
        actived.tab('show');
      });
    },

    drag: function () {//todo
      var $this = this.element;
    },

  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab;

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('tab');

      if (!data) {
        $this.data('tab', (data = new Tab(this)));
      }

      if (typeof option == 'string') {
        data[option]();
      }

    })
  }

  $.fn.tab.Constructor = Tab;


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click', '.tab_nav a', function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  $(document).on('mouseover', '.tab_nav a', function (e) {
    e.preventDefault();
    $(this).tab('hover');
  });

}(window.jQuery);