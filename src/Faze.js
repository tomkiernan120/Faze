(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory(root));
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.Faze = factory(root);
  }
})(
  typeof global !== "undefined" ? global : window || this.global,
  function (root) {
    "use strict";

    //
    // Variables
    //
    var identifier,
    attributes,
    psuedos,
    rootFaze;

    var Faze = {}; // Object for public APIs
    var supports = !!document.querySelector && !!root.addEventListener; // Feature test
    var settings; // Placeholder variables

    // Default settings
    var defaults = {
      identifiers: {
        "ID" : new RegExp( "^#(" + identifier + ")" ),
        "CLASS": new RegExp( "^\\.(" + identifier + ")" ),
        "TAG": new RegExp( "^(" + identifier + "|[*])" ),
        "ATTR": new RegExp( "^" + attributes ),
        "PSEUDO": new RegExp( "^" + psuedos ), 
      }
    };

    //
    // Methods
    //



    //
    // Selectors
    // 


    // @todo add plugin methods here

    // strings
    Faze.trim = function (string) {
      return string.replace(/\s*$/g, '' );
    }

    Faze.rtrim = (string) => {
    return string.replace( /^\s*/g, '' );
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

    Faze.range = ( min, max, steps ) => {
      min = min || 0;
      max = max;
      steps = steps || 1;

      var numbersArray = [];
      for (let i = min; i <= max; i += steps) {
        numbersArray.push( i );
      }

      return numbersArray;
    }

    Faze.shuffle = ( array ) => {
      return array.sort( () => { return Math.random() - 0.5; } );
    }

    Faze.min = ( array ) => {
      return Math.min( ...array );
    }

    Faze.max = ( array ) => {
      return Math.max( ...array );
    }

    // Numbers
    Faze.random = ( range ) => {
      var max, min;
      if( typeof( range ) === 'array' ){
        min = range[0];
        max = range[range.length - 1];
      }

      if( min && max ){
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
      }
    }

    // objects
    Faze.merge = (obj, src) => {
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
    Faze.fn = Faze.prototype = {

      constructor: Faze,

      init: function( selector, context, rootFaze ){
        // feature test
        if (!supports) return;

        if( !selector ){
          return this;
        }

        if( selector.nodeType ){
          this.context = this[0] = selector;
          this.length = 1;
          return this;
        }


        if( typeof selector === "string" ){
         // handle html  
        }
        else if( !context || context.Faze ){
          return ( context || rootFaze.find( selector ) );
        }
        else {
          // passing back context to find selector ie. F( ".text", document );
          return this.constructor( context ).find( selector );
        }
  
        // Destroy any existing initializations
        Faze.destroy();
  
        // Merge user options with defaults
        settings = this.merge(defaults, options || {});
  
  
        // Add class to HTML element to activate conditional CSS
        // TODO: Worry about class List
        // document.documentElement.classList.add(settings.initClass);
  
        // @todo Do stuff...
  
        // Listen for click events
        document.addEventListener("click", eventHandler, false);

        window.Faze = window.F = Faze;
    
        return Faze;
    },

  }
);
