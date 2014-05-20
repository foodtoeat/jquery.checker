/*!
 * Checker Plugin for Twitter Bootstrap
 *
 * Copyright 2014 FoodToEat, Phil Condreay (phil@foodtoeat.com)
 *
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

(function($, window, document, undefined) {
  'use strict';

  var
    defaults = {
      invalid_class: 'checker-invalid',
      invalid_callback: function() {
        this.$el.addClass(this.invalid_class);
        this.$el.tooltip({
          title: $.proxy(this['tooltip_' + this.invalid_reason], this)()
        });
      },
      valid_callback: function() {
        this.$el.removeClass(this.invalid_class);
        this.$el.tooltip('destroy');
      },
      validate: function() {
        var
          type = $.proxy(this.get_type, this)(),
          validate = $.proxy(this['validate_' + type], this),
          is_valid = (validate ? validate() : true);

        if (!is_valid) {
          this.invalid_reason = type;
        }
        if (this.required && !this.$el.val()) {
          this.invalid_reason = 'required';
          is_valid = false;
        } else if (!this.required && !this.$el.val()) {
          is_valid = true;
        }

        if (is_valid) {
          $.proxy(this.valid_callback, this)();
        } else {
          $.proxy(this.invalid_callback, this)();
        }
      },
      required: false,
      type: null,
      validate_tel: function() {
        return this.$el.val().match(/[0-9]/g).length >= 10;
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
      }
      tooltip_float: function() {
        return 'This is not a valid number.'
      },
      tooltip_required: function() {
        return 'This is a required field.'
      },
      validate_on_init: true
    },
    Checker = function(element, opts) {
      var
        self = this,
        option_key;

      self.$el = $(element);

      for (option_key in defaults) {
        self[option_key] = opts[option_key]
      }

      self._init();
    };

  Checker.prototype = {
    constructor: Checker,
    _init: function() {
      var
        self = this,
        type = $.proxy(self.get_type, self)();

      this.$el.on('change', function() {
        $.proxy(self.validate, self)();
      });

      if (this.validate_on_init) {
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
