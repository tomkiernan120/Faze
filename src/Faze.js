(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory(root));
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.Faze = factory(root);
  }
})(
  typeof global !== "undefined" ? global : this.window || this.global,
  function (root) {
    "use strict";

    //
    // Variables
    //

    var Faze = {}; // Object for public APIs
    var supports = !!document.querySelector && !!root.addEventListener; // Feature test
    var settings; // Placeholder variables

    // Default settings
    var defaults = {

    };

    //
    // Methods
    //

    // @todo add plugin methods here

    // strings
    Faze.trim = function (string) {

    }

    // arrays
    Faze.inArray = function (needle, haystack) {
      if (typeof indexOf == "function") {
        return haystack.indexOf(needle);
      } else {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
          if (haystack[i] == needle) {
            return i;
          }
        }
        return -1;
      }
    };

    Faze.chunk = function (array, n) {
      if (!n) {
        n = 1;
      }
      var length = array.length;
      var chunklength = length / n;
      var newArray = [];

      // TODO: fix ECMA 6 version
      if (typeof array.map === "function") {
        return array.map(function (_, i) {
          return array.slice(i * chunklength, i * chunklength + n);
        });
      } else {
        for (var i = 0; i < array.length; i += chunklength) {
          newArray.push(array.slice(i, i + chunklength));
        }
      }

      return newArray;
    };


    // objects
    Faze.merge = function (obj, src) {
      if (typeof Object.keys !== 'undefined') {
        Object.keys(src).forEach(function (key) {
          obj[key] = src[key]
        });
      } else {
        // Support for older browsers
        for (var key in src) {
          if (sr.hasOwnProperty(key)) {
            obj[key] = src[key];
          }
        }
      }
      return obj;
    };

    /**
     * Handle events
     * @private
     */
    var eventHandler = function (event) {
      // @todo Do something on event
    };

    /**
     * Destroy the current initialization.
     * @public
     */
    Faze.destroy = function () {
      // If plugin isn't already initialized, stop
      if (!settings) return;

      // Remove init class for conditional CSS
      // TODO: Worry about class List
      // document.documentElement.classList.remove(settings.initClass);

      // @todo Undo any other init functions...

      // Remove event listeners
      document.removeEventListener("click", eventHandler, false);

      // Reset variables
      settings = null;
    };

    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    Faze.init = function (options) {
      // feature test
      if (!supports) return;

      // Destroy any existing initializations
      Faze.destroy();

      // Merge user options with defaults
      settings = this.merge(defaults, options || {});

      if (window.console) {
        console.log(settings);
      }

      // Add class to HTML element to activate conditional CSS
      // TODO: Worry about class List
      // document.documentElement.classList.add(settings.initClass);

      // @todo Do stuff...

      // Listen for click events
      document.addEventListener("click", eventHandler, false);
    };

    //
    // Public APIs
    //

    var F = window.Faze;

    return Faze;
  }
);
