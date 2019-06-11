(function(){

    var domReadyStack = [];

    function handleDOmReady(fn) {
      return document.readyState === 'complete' ? fn.call( document ) : domReadyStack.push( fn );
    }

    document.addEventListener( 'DOMContentLoaded', function onDOMReady() {
      document.removeEventListener( 'DOMContentLoaded', onDOMReady );
      while( domReadyStack.length ) {
        domReadyStack.shift().call( document );
      }
    });

    var defaults = {
      version: "1.0.0"
    };

    /**
     * [Faze instance constructor]
     * @param {Faze} selector [description]
     */
    var Faze = function( selector ) {

      if( !(this instanceof Faze) ) {
        return new Faze( selector );
      }

      if( !selector ){
        return;
      }

      var extended = {};

      console.log( this );

      for( var prop in defaults ) {
        if(Object.prototype.hasOwnProperty.call( defaults, prop ) ) {
          extended[prop] = defaults[prop];
          this[prop] = defaults[prop];
        }
      }

      this.length = 0;
      this.nodes  = [];
      this.events = [];
      this.cache  = [];

      console.log( selector );

      if( selector instanceof HTMLElement || selector instanceof NodeList ) {
        this.nodes = selector.length > 1 ? [].slice.call( selector ) : [ selector ];
      }
      else if( typeof selector === 'string' ) {
        if( selector[0] === '<' && selector[selector.length - 1] === '>' ) {
          this.nodes = [ createNodes( selector ) ];
        }
        else {
          this.nodes = [].slice.call( document.querySelectorAll( selector ) );
        }
      }

      if( this.nodes.length ) {
        this.length = this.nodes.length;
        for( var i = 0; i < this.nodes.length; i++ ) {
          this[i] = this.nodes[i];
        }
      }
    };

    Faze.fn = Faze.prototype;
    window.Faze = window.fz = Faze;

    // private functions ====================================

    /**
     * [createNodes - create custom html nodes]
     * @param  {string} html [html string]
     * @return {node}      [returns html node]
     */
    function createNodes( html ) {
      var div = document.createElement( 'div' );
      div.innerHTML = html;
      return div.firstChild;
    }

    function class2type() {
      return {};
    }

    function isWindow( obj ) {
      return obj != null && obj === obj.window;
    }

    function isLikeArray( obj ) {
      var length = !!obj && obj.length;
      var type = toType( obj );
      if( typeof obj === "function" || isWindow( obj ) ) {
        return false;
      }

      return type === "array" || length === 0 || typeof length === "number" && length > 0 && ( length -1 ) in obj;
    }

    function toString() {
      return class2type.toString;
    }

    function isHTMLElement( option ) {
      return option instanceof HTMLElement;
    }

    function isNodeList( options ) {
      return options instanceof NodeList();
    }

    function toType( obj ) {
      if( obj == null ) {
        return obj + "";
      }

      return typeof obj === "object" ? 
        class2type[ toString.call( obj ) ] || "object" :
        typeof obj;
    }

    /**
     * Loop through each element
     * @param  {Function} callback [callback function]
     * @return {Faze}            [returns faze instance]
     */
    Faze.fn.each = function( callback ) {
      for( var i = 0; i < this.length; i++ ) {
        callback.call( this, this[i], i );
      }
      return this;
    } 

    Faze.fn.domReady = handleDOmReady;

    Faze.fn.isHTMLElement = isHTMLElement;
    Faze.fn.isNodeList = isNodeList;

    // class helper ======================================
    Faze.fn.addClass = function( classname ) {
      this.each( function( item ) {
        item.classList.add( classname );
      }); 
      return this;
    } 

    Faze.fn.removeClass = function( classname ) {
      this.each( function( item ) {
        item.classList.remove( classname );
      });
    }

    Faze.fn.toggleClass = function( classname ) {
      this.each( function( item ) {
        if( item.classList.contains( classname ) ) {
          this.removeClass( classname );
        }
        else {
          this.addClass( classname );
        }
      });
    }

    Faze.fn.hasClass = function( classname ) {
      var hasClass = false;
      this.each( function( item ) {
        hasClass = item.classList.contains( classname );
      });
      return hasClass;
    }


    // styling ============================================
    Faze.fn.css = function( opt1, opt2 ) {
      if( typeof opt1 === 'string' && typeof opt2 === 'string' ) {
        this.each( function( item ) {
          if( null !== item.style[opt1] ) {
            item.style[opt1] = opt2;
          }
        });
      }
      else if( typeof opt1 === "object" ) {
        this.each( function( item ) {
          Faze( opt1 ).each( function( option, index ) {
            item.style[index] = option[index];
          })
        });
      }
    }

    Faze.fn.changeColour = function( color, ammount ) {
      var useHash = false;

      if( color[0] === '#' ) {
        color = color.slice( 1 );
        useHash = true;
      }

      var num = parseInt( color, 16 );

      var r = ( num >> 16 ) + ammount;

      if( r > 255 ) {
        r = 255;
      }
      else if( r < 0 ) {
        r = 0;
      }

      var b = (( num >> 8 ) & 0x00FF ) + ammount;

      if( b > 255 ) {
        b = 255; 
      }
      else if( b < 0 ) {
        b = 0;
      }

      var g = (num & 0x0000FF) + ammount;

      if( g > 255 ) {
        g = 255;
      }
      else if( g < 0 ) {
        g = 0;
      }

      return ( useHash ? '#' : '' ) + ( g |( b << 8 ) | ( r << 16 ) ).toString( 16 );
    }


    // String =============================================
    Faze.fn.trim = function( string ) {
      return string.replace( /\s+/g, '' );
    }


    // array ==============================================
    Faze.fn.isArray = function( array ) {
      return [].isArray( array );
    }

    Faze.fn.inArray = function( value, array ) {
      if( array && this.isArray( array ) ) {
        return array.indexOf( value ) > -1;
      }
      else if( this.isArray( this.nodes ) ) {
        return this.nodes.indexOf( value ) > -1; 
      }
      return false;
    } 

    Faze.fn.merge = function( array1, array2 ) {
      var newArray = array1;

      for( var i = 0; i < array2.length; i++ ) {
        newArray[i] = array2[i];
      }

      return newArray;
    }

    Faze.fn.makeArray = function( opt ) {
      var ret = [];
      if( opt != null ) {
        if( isLikeArray( opt ) ) {
          this.merge( ret, typeof opt === "string" ? [ opt ] : opt )
        }
        else {
          [].push.call( ret, opt );
        }
      }
      return ret;
    }

    Faze.fn.sort = function( array ) {
      return array.sort( function( a, b ) {
        return a.toLowerCase().localeCompare( b.toLowerCase() );
      });
    }

    Faze.fn.random = function( array ) {
      return array[ Math.floor( Math.random() * array.length ) ];
    }

    Faze.fn.flattenArray = function( array ) {
      if( this.isArray( array ) ) {
        return array.flat( Infinity );
      }
    }

    // Objects ============================================
    Faze.fn.compare = function( object, propname ) {
      return object.sort( function( a, b ) {
        return a[propname].toLowerCase() == b[propname].toLowerCase() ? 0 : a[propname].toLowerCase() < b[propname].toLowerCase() ? -1 : 1;
      }); 
    }

    Faze.fn.print_r = function( object ) {
      return JSON.stringify( object, null, '\t' ).replace( /\n/g, '<br/>' ).replace( /\t/g, '&nbsp;&nbsp;&nbsp;' );
    }

    // Helper ========================================
    Faze.fn.functionExists = function( functionName ) {
      return typeof functionName == 'function';
    }

    Faze.fn.add = function( option ) {
      if( option instanceof HTMLElement  ) {
        this[this.length+1] = HTMLElement;
      }
      else if( option instanceof NodeList ) {
        var list = this.merge( this.nodes, NodeList );
        for( var i = 0; i < list.length; i++ ) {
          this[this.length+1] = list[i];
        }
      }
    }

    // Faze.fn.after = function( option ) {

    // }

    // Faze.fn.append = function( option ) {

    // }

    Faze.fn.attr = function( options ) {
      if( !options ) {
        this.each( function( item ) {
          return item.attributes;
        });
      }
    }

    // Faze.fn.before = function( option ) {

    // } 

    Faze.fn.children = function() {
      var children = [];
      this.each( function( item ) {
        if( item.hasChildNodes() ) {
          children.push( this.makeArray( item.children ) );
        }
      });

      return new Faze( children );
    }

    // Faze.fn.parent = function( option ) {

    // }

    Faze.fn.clone = function( options ) {
      var elems = [];
      this.each( function( item ) {
        elems.push( item.clone( options ) );
      });
      return elems;
    }

    // Faze.fn.delay = function( option ) {

    // }

    // Faze.fn.index = function( option ) {

    // }

    // Faze.fn.fadeIn = function() {

    // }

    // Faze.fn.fadeOut = function() {

    // }

    // Faze.fn.toggleFade = function() {

    // }

    Faze.fn.html = function() {
      var str = '';
      this.each( function( item ) {
        str += item.outerHTML;
      });
      return str;
    }

    Faze.fn.text = function() {
      var str = this.html();
      return str.replace( /<[^>]*>/gm, '' );  
    }

    // Faze.fn.isEmptyObject = function( object ) {

    // }

    Faze.fn.isNumeric = function( number ) {
      if( !( typeof number === "string" ) && !( typeof number === "number" )  ) {
        return false;
      }
      return number.match( /^[\d.]+?/ );
    }

    // Faze.fn.parseHTML = function() {
      
    // }

    // Faze.fn.unique = function() {

    // }

    // Faze.fn.next = function() {

    // }

    Faze.fn.on = function( eventType, callback, selector ) {
      var events = eventType.split( ' ' );

      for( var i = 0; i < events.length; i++ ) {
        var event = events[i];

        this.each( function( item ) {
          if( !selector ){
            item.addEventListener( event, callback );
          }
          else {
            item.addEventListener( event, function(e) {
              console.log( e );
            });
          }
        });

      }
    }

    Faze.fn.wrap = function( html ) {
      var wrapper = createNodes( html );

      this.each( function( item ) {
        item.parentNode.insertBefore( wrapper, item );
        wrapper.appendChild( item );  
      });
    }

    Faze.fn.poll = function( fn, timeout, interval ) {
      var endTime = Number( new Date() ) + ( timeout || 2000 );
      interval = interval || fn();
      var checkCondition = function( resolve, reject ) {
        var result = fn();
        if( result ) {
          resolve( result );
        }
        else if( Number( new Date() ) < endTime ) {
          setTimeout( checkCondition, interval, resolve, reject );
        }
        else {
          reject( new Error( 'Timed out for ' + fn + ': ' + arguments ) );
        }
      }

      return new Promise( checkCondition );
    }

    Faze.fn.once = function( fn, context ) {
      var result;

      return function() {
        if( fn ) {
          result = fn.apply( context || this, arguments );
        }

        return result;
      }
    }

    Faze.fn.debouce = function( func, wait, immediate ) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if( !immediate ) {
            func.apply( context, args );
          }
        };
        var callNow = immediate && !timeout;
        clearTimeout( timeout );
        timeout = setTimeout( later, wait );
        if( callNow ) {
          func.apply( context, args );
        }
      }
    }


    return new Faze();
})();