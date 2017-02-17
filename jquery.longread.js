/**
 * @file
 * LongRead jQuery plugin.
 */

var LongRead = LongRead || {};

(function($, window, document, undefined){
  "use strict";

  var defaults = {
    height: 100,
    full_height: null,
    height_correction: 0,
    read_more_text: 'Read more',
    read_less_text: 'Read less',
    read_less: true,
    icon: null,
    icon_less: null,
    trigger_class: null,
    line_height: 1,
    cover_class: null,
    show_lines: 30
  };

  LongRead = function(el, options) {
    // Remember defaults.
    this._defaults = defaults;
    this._name = 'longread';

    // Setup element.
    this.element = el;
    this.$el = $(this.element);
    this.init(options);
    this.prepare();
    this.events();

    this.$el.trigger('longread:ready', this);
  };

  LongRead.prototype.init = function(options) {
    var attributes = this._getAttributes();
    this.options = $.extend({}, defaults, options, attributes);
    if (this.options.line_height && this.options.show_lines && !this.$el.attr('data-long-read-height')) {
      var h = this.options.line_height * this.options.show_lines;
      if (h > 0) {
        this.options.height = h;
      }
    }
    // Make possible to override settings.
    this.$el.trigger('longread:get_height', this.options);
  };

  LongRead.prototype._getAttributes = function() {
    var attributes = {
      full_height: this.$el.height(),
      icon: this.$el.attr('data-long-read-icon'),
      icon_less: this.$el.attr('data-long-read-icon-less'),
      trigger_class: this.$el.attr('data-read-trigger-class'),
      line_height: parseInt(this.$el.css('line-height')),
      show_lines: parseInt(this.$el.attr('data-long-read-lines')),
      additional_trigger: null
    };

    var optional = {
      height: 'height',
      read_more_text: 'moretxt',
      read_less_text: 'lesstxt',
      read_less: 'less',
      cover_class: 'cover-class',
      additional_trigger: 'additional-trigger'
    };
    for (var attribute in optional) {
      if (optional.hasOwnProperty(attribute)) {
        var attribute_name = ('data-long-read-' + optional[attribute])
          , attribute_value = this.$el.attr(attribute_name)
          ;
        if (attribute_value) {
          attributes[attribute] = attribute_value;
        }
      }
    }

    return attributes;
  };

  LongRead.prototype._getAdditionalTrigger = function() {
    var $trigger = null;
    if (this.options.additional_trigger) {
      $trigger = $(this.options.additional_trigger);
    }
    else if (this.$el.attr('id')) {
      $trigger = $('[data-toggle="long-read"][data-target="#' + this.$el.attr('id') + '"]');
    }

    if ($trigger && $trigger.length) {
      $trigger.addClass('long-read-additional-trigger');
      return $trigger;
    }
    return null;
  };

  LongRead.prototype.prepare = function() {
    this.$el.trigger('longread:before_prepare', this);
    // wrap long text and read more listings
    if (this.options.full_height <= this.options.height) {
      return;
    }

    var cover_classes = 'long-read-cover long-read-closed';
    if (this.options.cover_class) {
      cover_classes += ' ' + this.options.cover_class;
    }
    this.$el.wrap('<div class="' + cover_classes + '" />');
    this.$cover = this.$el.parent();
    this.options.height_correction = this.$el.height() - this.options.full_height;
    this.$cover.append('<div class="long-read-more"></div>');
    var text = '<em>' + this.options.read_more_text + '</em>';
    if (this.options.icon) {
      text += '<i class="' + this.options.icon + '"></i>';
    }

    var trigger_class = 'more-link trigger';
    if (this.options.trigger_class) {
      trigger_class += ' ' + this.options.trigger_class;
    }
    this.$trigger = $('<a class="' + trigger_class + '">' + text + '</a>');
    this.$additionalTrigger = this._getAdditionalTrigger();
    this.$cover.find('.long-read-more').append(this.$trigger);
    this.$el.height(this.options.height);
  };

  LongRead.prototype.events = function() {
    var L = this;
    if (L.$trigger) {
      L.$trigger.on('click', function(ev) {
        L.click(ev);
      });
    }
    if (L.$additionalTrigger) {
      L.$additionalTrigger.on('click', function(ev) {
        L.click(ev);
      });
    }
  };

  LongRead.prototype.destroy = function() {
    if (this.$trigger) {
      this.$trigger.off('click');
      this.$trigger.remove();
    }

    this.$el.removeAttr('style');
    this.$el.removeClass('long-read-preparated');

    if (this.$cover && this.$cover.length) {
      this.$el.unwrap();
    }
  };

  LongRead.prototype.click = function(ev) {
    ev.preventDefault();
    var L = this
      , text = L.options.read_more_text
      , icon = {}
      , height = L.options.full_height + L.options.height_correction
      , expanded = false
      , event = 'open'
      , event_after = 'opened'
      ;

    this.$el.trigger('longread:click', this);
    if (L.options.read_less) {
      if (L.$cover.hasClass('long-read-closed')) {
        // if container is closed, open it
        L.$cover.removeClass('long-read-closed').addClass('long-read-open');
        text = L.options.read_less_text;
        icon = {
          show: L.options.icon_less,
          hide: L.options.icon
        };
        expanded = true;
      }
      else {
        // if container is open, let's close it
        L.$cover.removeClass('long-read-open').addClass('long-read-closed');
        icon = {
          show: L.options.icon,
          hide: L.options.icon_less
        };
        height = L.options.height;
        expanded = false;
        event = 'close';
        event_after = 'closed';
      }
    }
    else {
      L.$trigger.fadeOut();
    }

    L.$el.trigger('longread:' + event, this);
    L.$el.animate(
      { height: height },
      500,
      function() {
        L.$trigger.find('em').html(text);
        L.$trigger.find('i').removeClass(icon.hide).addClass(icon.show);

        L.$trigger.attr('aria-expanded', expanded ? 'true' : 'false');
        L.$additionalTrigger.attr('aria-expanded', expanded ? 'true' : 'false');

        L.$el.trigger('longread:' + event_after, this);
        setTimeout(function() {
          $(window).trigger('resize');
        }, 600);
      }
    );
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn.longread = function() {
    var options = {}
      , method = 'init'
      , key = 'plugin_longread'
      ;

    if (arguments[0]) {
      if (typeof arguments[0] === 'string') {
        method = arguments[0];
      }
      else if (typeof arguments[0] === 'object') {
        options = arguments[0];
      }
    }

    if (arguments[1] && (typeof arguments[1] === 'object')) {
      options = arguments[1];
    }

    return this.each(function() {
      if (!$.data(this, key)) {
        $.data(this, key, new LongRead(this, options));
      }

      if (
        method
        && method !== 'init'
        && (typeof $(this).data(key)[method] === 'function')
      ) {
        $(this).data(key)[method](options);
        if (method === 'destroy') {
          $.data(this, key, null);
        }
      }
    });
  };

})(jQuery, window, document);
