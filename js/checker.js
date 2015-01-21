/*!
 * Checker Plugin for Twitter Bootstrap
 *
 * Copyright 2014 FoodToEat, Phil Condreay (phil@foodtoeat.com)
 *
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */
'use strict';

(function($, window, document, undefined) {
  var
    defaults = {
      invalid_class: 'checker-invalid',
      make_tooltip: function($el) {
        $el.tooltip({
          title: $.proxy(this['tooltip_' + this.invalid_reason], this)()
        });
        $el.data('bs.tooltip').options.template = 
          '<div class="tooltip checker-invalid-tooltip">' +
            '<div class="tooltip-inner">' +
            '</div>' +
          '</div>';
      },
      invalid_callback: function() {
        var
          select2 = this.$el.parent().find('select2-choices'),
          select2_input = select2.find('input'),
          is_select2 = select2.length;

        if (is_select2) {
          select2.addClass('select2-invalid');
          select2_input.addClass('invalid');
          select2_input.tooltip({
            title: $.proxy(this['tooltip_' + this.invalid_reason], this)()
          });
          select2.tooltip({
            title: $.proxy(this['tooltip_' + this.invalid_reason], this)()
          });
        } else {
          this.$el.addClass(this.invalid_class);
          $.proxy(this.make_tooltip, this)(this.$el);
        }
      },
      valid_callback: function() {
        var
          select2 = this.$el.parent().find('select2-choices'),
          select2_input = select2.find('input'),
          is_select2 = select2.length;

        if (is_select2) {
          select2.removeClass('select2-invalid');
          select2_input.removeClass('invalid');
          select2_input.tooltip('destroy');
          select2.tooltip('destroy');
        } else {
          this.$el.removeClass(this.invalid_class);
          this.$el.tooltip('destroy');
        }
      },
      validate: function() {
        var
          type = $.proxy(this.get_type, this)(),
          validate = $.proxy(this['validate_' + type], this);

        delete this.invalid_reason;
        $.proxy(this.valid_callback, this)();

        if (this.disabled) {
          return
        }

        if (this.required && !this.$el.val()) {
          this.invalid_reason = 'required';
        } else if (this.$el.val() && (validate ? !validate() : false)) {
          this.invalid_reason = type;
        }

        if (this.invalid_reason) {
          $.proxy(this.invalid_callback, this)();
        }
      },
      required: false,
      type: null,
      validate_tel: function() {
        var matches = this.$el.val().match(/[0-9]/g)
        return matches && matches.length >= 10;
      },
      tooltip_tel: function() {
        return 'Telephone numbers must be at least ten digits.'
      },
      validate_email: function() {
        return this.$el.val().match(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/);
      },
      tooltip_email: function() {
        return 'This is not a valid email.'
      },
      validate_url: function() {
        return this.$el.val().match(/^((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/);
      },
      tooltip_url: function() {
        return 'This is not a valid url.'
      },
      validate_float: function() {
        return this.$el.val().match(/^[0-9]*((\.|,)[0-9]+)?$/);
      },
      tooltip_float: function() {
        return 'This is not a valid number.'
      },
      validate_account_number: function() {
        return this.$el.val().match(/^\w{1,17}$/);
      },
      tooltip_account_number: function() {
        return 'This is not an account number.'
      },
      validate_routing_number: function() {
        return this.$el.val().replace(/ /g,'').match(/^((0[0-9])|(1[0-2])|(2[1-9])|(3[0-2])|(6[1-9])|(7[0-2])|80)([0-9]{7})$/);
      },
      tooltip_routing_number: function() {
        return 'This is not a routing number.'
      },
      validate_ein: function() {
        return this.$el.val().match(/^[0-9]{2}\-?\d{7}$/);
      },
      tooltip_ein: function() {
        return 'This is not a valid EIN#';
      },
      tooltip_required: function() {
        return 'This is a required field.'
      },
      validate_on_init: true,
      disable: function() {
        this.valid_callback();
        this.disabled = true;
      },
      enable: function() {
        this.disabled = false;
        this.validate();
      },
      disabled: false,
      events: 'change'
    },
    Checker = function(element, opts) {
      var
        self = this,
        option_key;

      self.$el = $(element);

      for (option_key in opts) {
        self[option_key] = opts[option_key]
      }

      self._init();
    };

  Checker.prototype = {
    constructor: Checker,
    _init: function() {
      var self = this;

      self.$el.on(self.events, function() {
        $.proxy(self.validate, self)();
      });

      if (self.validate_on_init) {
        $.proxy(self.validate, self)();
      };
    },
    get_type: function() {
      return (this.type || this.$el.prop('type'));
    }
  };

  $.fn.checker = function(option) {
    var args = Array.apply(null, arguments);
    args.shift();

    return this.each(function() {
      var
        $this = $(this),
        data = $this.data('checker'),
        options = typeof option === 'object' && option;

      if (!data) {
        $this.data('checker', (data = new Checker(
          this, $.extend({}, defaults, options, $this.data())
        )));
      }

      if (typeof option === 'string') {
        data[option].apply(data, args);
      }
    });
  };
})(jQuery, window, document);
