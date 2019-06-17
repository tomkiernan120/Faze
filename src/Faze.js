(function(){

    var domReadyStack = [];

    var isSimple = /^.[^:#[.,]*$/;
    // var singleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
    // var quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/;
    // var readyBound = false;


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
      version: '[VERSION]'
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

      if( selector instanceof HTMLElement || selector instanceof NodeList ) {
        this.nodes = selector.length > 1 ? [].slice.call( selector ) : [ selector ];
      }
      else if( typeof selector === "object" && selector.toString() === "[object HTMLDocument]" ) {
        this.nodes = [ selector ];
        this.length = 1;
      }
      else if( selector instanceof Array ) {
        this.nodes = selector;
        this.length = selector.length;
      }
      else if( typeof selector === 'string' ) {
        if( selector[0] === '<' && selector[selector.length - 1] === '>' ) {
          this.nodes = [ createNodes( selector ) ];
        }
        else {
          if( selector.match( isSimple ) ){ 
            try{
              this.nodes = [].slice.call( document.querySelectorAll( selector ) );
            }
            catch( e ){
              throw new Error( e );
            }
          }
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

    /**
     * [ test if node is window ]
     * @param  {[node]}
     * @return {Boolean}
     */
    function isWindow( obj ) {
      return obj != null && obj === obj.window;
    }

    /**
     * [check if object is array like]
     * @param  {[type]}
     * @return {Boolean}
     */
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

    /**
     * [check if node is htmlelement]
     * @param  {[node]}
     * @return {Boolean}
     */
    function isHTMLElement( option ) {
      return option instanceof HTMLElement;
    }

    /**
     * [ check if options is NodeList ]
     * @param  {[HTMLCollection|NodeList]}
     * @return {Boolean}
     */
    function isNodeList( options ) {
      return options instanceof NodeList();
    }

    /**
     * @param  {[Object]}
     * @return {[type]}
     */
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

    /**
     * [domReady function]
     */
    Faze.fn.domReady = handleDOmReady;

    /**
     * [isHTMLElement function]
     */
    Faze.fn.isHTMLElement = isHTMLElement;

    /**
     * [isNodeList function]
     * @type {Boolean}
     */
    Faze.fn.isNodeList = isNodeList;

    // class helper ======================================
    /**
     * [Add a class to DOM Elements]
     * @param {[string]} classname [string of the classname]
     */
    Faze.fn.addClass = function( classname ) {
      this.each( function( item ) {
        item.classList.add( classname );
      }); 
      return this;
    } 



    /**
     * [Remove class from DOM Elements]
     * @param  {[type]} classname [description]
     */
    Faze.fn.removeClass = function( classname ) {
      this.each( function( item ) {
        item.classList.remove( classname );
      });
    }

    /**
     * [add or remove classname from DOM Elements]
     * @param  {[string]} classname [description]
     */
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

    /**
     * [Check if DOM Elements has classname]
     * @param  {[string]}  classname [classname as string]
     * @return {Boolean}           
     */
    Faze.fn.hasClass = function( classname ) {
      var hasClass = false;
      var useMatch = classname.split( /[.#:~*]/ ).length > 1 ? true : false;
      this.each( function( item ) {
        if( useMatch ) {
          hasClass = item.matches( classname );
        }
        else {
          hasClass = item.classList.contains( classname );
        }
      });
      return hasClass;
    }

    // styling ============================================
    /**
     * [Add CSS to a DOM elements]
     * @param  {[string|object]} opt1 [String for css attribute name | object with css methods]
     * @param  {[optional|string]} opt2 [string for setting CSS value]
     */
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

    /**
     * [Change color by ammount]
     * @param  {[string]} color   [hexidecimal or rgb color value]
     * @param  {[int]} ammount [percentage to change color by]
     * @return {[string]}         [returns hexidecimnal or rgb]
     */
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
    /**
     * [Remove all whitespace from a string]
     * @param  {[string]} string 
     * @return {[string]}        [return string without whitespace]
     */
    Faze.fn.trim = function( string ) {
      return string.replace( /\s+/g, '' );
    }

    /**
     * [Return size of string in bytes]
     * @param  {[string]} string 
     * @return {[integer]}        [bytes of string]
     */
    Faze.fn.byteSize = function( string ) {
      return new Blob([ string ]).size;
    }

    /**
     * [Capitalize string]
     * @param  {[string]} string    
     * @param  {[boolean]} lowerRest [set all other characters to lowercase]
     * @return {[string]}           
     */
    Faze.fn.capitalize = function( string, lowerRest ) {
      return ( string[0].toUpperCase() + ( lowerRest ? string.substr( 1 ).toLowerCase() : string.substr( 1 ) ) );
    }

    /**
     * [Capitalize each word]
     * @param  {[type]} string [description]
     * @return {[type]}        [description]
     */
    Faze.fn.capitalizeWords = function( string ) {
      return string.replace( /\b[a-z]/g, function( char ) {
          return char.toUpperCase();
      });
    }

    /**
     * [DeCapitalize string]
     * @param  {[string]} string   
     * @param  {[boolean]} upperRest [Set all other characters to uppercase]
     * @return {[string]}           [Return decapitalised string]
     */
    Faze.fn.deCapitalize = function( string, upperRest ) {
      return string[0].toLowerCase() + ( upperRest ? string.substr( 1 ).toUpperCase() : string.substr( 1 ) );
    }

    // TODO: validate CSV data;
    // Faze.fn.validateCSV = function( data ) {

    // }

    /**
     * [Convert CSV string to array]
     * @param  {[string]} data          [CSV string]
     * @param  {[type]} delimiter     [description]
     * @param  {[type]} onmitFirstRow [description]
     * @return {[type]}               [description]
     */
    Faze.fn.csvToArray = function( data, delimiter, onmitFirstRow ) {
      return data.slice( onmitFirstRow ? data.indexOf('\n') + 1 : 0 ).split( '\n' ).map( function( v ) {
        return v.split( delimiter ? delimiter : ',' );
      });
    }

    Faze.fn.csvToJSON = function( data, delimiter ) {
      var titles = data.slice( 0, data.indexOf( '\n' ) ).split( delimiter ? delimiter : ',' );
      return data.slice( data.indexOf( '\n' ) + 1 ).split( '\n' ).map( function( v ) {
          var values = v.split( delimiter ? delimiter : ',' );
          return titles.reduce( function( obj, title, index ) {
              return ( ( obj[title] = values[index] ), obj ) 
          }, {});
      });
    }

    /**
     * [escape HTML string for output to client]
     * @param  {[string]} string [HTML risky string]
     * @return {[string]}        [returned string with all html elements escaped]
     */
    Faze.fn.escapeHTML = function( string ){
      return string.replace( /[&<>'"]/g, function( tag ) {
          return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' } [tag] || tag );
      });
    }

    /**
     * Convert camel case to seperated
     * @param  {string} string    
     * @param  {string} seperator seperator you with to use between words (Defaults: _)
     * @return {string}           seperated string
     */
    Faze.fn.fromCamelCase = function( string, seperator ) {
      return string.replace( /([a-z\d])([A-Z])/g, '$1' + (seperator ? seperator : '_' ) + '$2' ).replace( /([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + ( seperator ? seperator : '_' ) + '$2' ).toLowerCase();
    }

    /**
     * Indet string at every start of new line
     * @param  {string} string 
     * @param  {interget} count  ammount of lines to indent
     * @param  {string} indent string to use for indent
     * @return {string}        Indented String
     */
    Faze.fn.indentString = function( string, count, indent ) {
      return string.replace( /^/gm, ( indent ? indent : ' ' ).repeat( count ) );
    }

    /**
     * Check if 1 word is an anagram of another
     * @param  {string}  str1 word to check
     * @param  {string}  str2 word to check against
     * @return {boolean}      
     */
    Faze.fn.isAnagram = function( str1, str2 ) {
      var normalize = function( str ) {
        str.toLowerCase().replace( /[^a-z0-9]/gi, '' ).split('').sort().join('');
      }
      return normalize( str1 ) === normalize( str2 );
    }

    /**
     * Check if string is lowercase
     * @param  {string}  str 
     * @return {Boolean}    
     */
    Faze.fn.isLowerCase = function( str ) {
      return str === str.toLowerCase();
    }

    /**
     * Check if string is uppercase
     * @param  {string}  str 
     * @return {Boolean}
     */
    Faze.fn.isUpperCase = function( str ) {
      return str === str.toUpperCase();
    }

    /**
     * Run function on every character of a string
     * @param  {string}   str 
     * @param  {Function} fn  function callback for each character
     * @return {string}       Edited string
     */
    Faze.fn.mapString = function( str, fn ) {
      return str.split( '' ).map( function( c, i ) {
        return fn( c, i, str );
      }).join('');
    }

    /**
     * Mask a number of characters of a string
     * @param  {string} cc   string to mask
     * @param  {interger} num  Number of characters to maske
     * @param  {string} mask character to use as a mask (Defaults to '*')
     * @return {string}      
     */
    Faze.fn.mask = function( cc, num, mask ) {
      return cc.slice( - ( num ? num : 4 ) ).padStart( cc.length, ( mask ? mask : '*' ) );
    }

    /**
     * Pad a string
     * @param  {string} str    
     * @param  {integer} length desired length of string
     * @param  {string} char   String to use as padding (Defaults to ' ')
     * @return {string}        Padded string
     */
    Faze.fn.pad = function( str, length, char ) {
      return str.padStart( ( str.length + length ) / 2, ( char ? char : ' ' ) ).padEnd( length, ( char ? char : ' ' ) );
    }

    /**
     * Pluralize value
     * @param  {string} val    String to pluralize
     * @param  {[type]} word   [description]
     * @param  {[type]} plural [description]
     * @return {[type]}        [description]
     */
    Faze.fn.pluralize = function( val, word, plural ) {
      plural = (plural ? plural : word + 's');
      var _pluralize = function( num,  word, plural ) {
        return [ 1, -1 ].includes( Number( num ) ) ? word : plural;
      }
      if( typeof val === 'object' ) {
        return function( num, word ) {
          return _pluralize( num, word, val[word] );
        }
      }
      return _pluralize( val, word, plural );
    }

    /**
     * Remove non ASCII characters from string 
     * @param  {string} string 
     * @return {string}        String without ASCII characters
     */
    Faze.fn.removeNonASCII = function( string ) {
      return string.replace( /[^\x20-\x7E]/g, '' );
    }

    // Array ==============================================
    /**
     * check if is array
     * @param  {array}  array value to check
     * @return {Boolean}       
     */
    Faze.fn.isArray = function( array ) {
      if( this.nodes ) {
        return Array.isArray( this.nodes );
      }
      else{
        return Array.isArray( array );
      }
    }

    /**
     * check if value is in array
     * @param  {[type]} value [description]
     * @optional
     * @param  {interger|string|boolean|array|object} array Any value that may be in array
     * @return {boolean}       
     */
    Faze.fn.inArray = function( value, array ) {
      if( array && this.isArray( array ) ) {      
        return array.indexOf( value ) > -1;
      }
      else if( this.isArray() ) {
        return this.nodes.indexOf( value ) > -1; 
      }
      return false;
    } 

    /**
     * [merge description]
     * @param  {[type]} array1 [description]
     * @param  {[type]} array2 [description]
     * @return {[type]}        [description]
     */
    Faze.fn.merge = function( array1, array2 ) { // TODO: needs way more and to be way cleverer that this rubbish
      var newArray = [];

      for( var i = 0; i < array2.length; i++ ) {
        newArray[i] = array2[i];
      }

      return newArray;
    }

    /**
     * [makeArray description]
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
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

    /**
     * [sort description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    Faze.fn.sort = function( array ) {
      if( this.nodes && this.isArray() ) {
        return this.nodes.sort( function( a, b ) {
          return a.toLowerCase().localeCompare( b.toLowerCase() ); 
        });
      }
      else {
        return array.sort( function( a, b ) {
          return a.toLowerCase().localeCompare( b.toLowerCase() );
        });
      }
    }

    /**
     * [random description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    Faze.fn.random = function( array ) {
      if( this.nodes ) {
        return array[ Math.floor( Math.random() * array.length ) ];
      }
      return array[ Math.floor( Math.random() * array.length ) ];
    }

    /**
     * [flattenArray description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    Faze.fn.flattenArray = function( array ) {
      if( this.nodes && this.isArray() ) {
        return this.node.flat( Infinity );
      }
      else if( this.isArray( array ) ) {
        return array.flat( Infinity );
      }
    }

    /**
     * [all description]
     * @param  {[type]}   array [description]
     * @param  {Function} fn    [description]
     * @return {[type]}         [description]
     */
    Faze.fn.all = function( array, fn ) {
      if( !fn ) {
        fn = Boolean;
      }
      if( this.nodes && this.isArray() ){
        return this.nodes.every( fn );
      }
      return array.every( fn );
    }

    /**
     * [allEqual description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    Faze.fn.allEqual = function( array ) {
      return array.every( function( val ) { return val === array[0] } );
    }

    /**
     * [any description]
     * @param  {[type]}   array [description]
     * @param  {Function} fn    [description]
     * @return {[type]}         [description]
     */
    Faze.fn.any = function( array, fn ) {
      if( !fn ) {
        fn = Boolean;
      }
      return array.some( fn );
    }

    /**
     * [arrayToCSV description]
     * @param  {[type]} array     [description]
     * @param  {[type]} delimiter [description]
     * @return {[type]}           [description]
     */
    Faze.fn.arrayToCSV = function( array, delimiter ) {
      array.map( function( value ) {
        return value.map( function( x ) {
          return (isNaN( x ) ? '"' + x.replace( /"/g, '""' ) + '"' : x ) 
        } ).join( delimiter ? delimiter : ',' ).join( '\n' );
      });
    }

    /**
     * [chunk description]
     * @param  {[type]} array [description]
     * @param  {[type]} size  [description]
     * @return {[type]}       [description]
     */
    Faze.fn.chunk = function( array, size ) {
      Array.from({ length: Math.ceil( array.length / size ) }, function( v, i ) {
        return array.slice( i * size, i * size, + size );
      });
    }

    /**
     * [filterFalse description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    Faze.fn.filterFalse = function( array ) {
      if( this.nodes ) {
        return this.nodes.filter( Boolean );
      }
      return array.filter( Boolean );
    }

    /**
     * [difference description]
     * @param  {[type]} a [description]
     * @param  {[type]} b [description]
     * @return {[type]}   [description]
     */
    Faze.fn.difference = function( a, b ) {
      var s = new Set( b );
      return a.filter( function( x ) {
        return !s.has( x );
      });
    }

    /**
     * [differenceBy description]
     * @param  {[type]}   a  [description]
     * @param  {[type]}   b  [description]
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    Faze.fn.differenceBy = function( a, b, fn ) {
      var s = new Set( b.map( fn ) );
      return a.map( fn ).filter( function( el ) {
        return !s.has( el );
      }); 
    }

    /**
     * [fitlerNonUnique description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    Faze.fn.fitlerNonUnique = function( array ) {
      return array.filter( function( i ) {
        return array.indexOf( i ) === array.lastIndexOf( i );
      });
    }

    /**
     * [findLast description]
     * @param  {[type]}   array [description]
     * @param  {Function} fn    [description]
     * @return {[type]}         [description]
     */
    Faze.fn.findLast = function( array, fn ){
      return array.filter( fn ).pop();
    }

    /**
     * [findLastIndex description]
     * @param  {[type]}   array [description]
     * @param  {Function} fn    [description]
     * @return {[type]}         [description]
     */
    Faze.fn.findLastIndex = function( array, fn ) {
      return array.map( function( val, i ) {
        return [ i, val ]; 
      }).filter( function(  i, val ) {
        return fn( val, i, array );
      }).pop()[0];
    }

    /**
     * [head description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    Faze.fn.head = function( array ) {
      return array[0];
    }

    /**
     * [shuffle description]
     * @param  {...[type]} array [description]
     * @return {[type]}          [description]
     */
    Faze.fn.shuffle = function( ...array ) {
      var m = array.length;
      while( m ) {
        var i = Math.floor( Math.random() * m-- );
        [ array[m], array[i] ] = [ array[i], array[m] ];
      }
      return array;
    }

    /**
     * [similarity description]
     * @param  {[type]} array  [description]
     * @param  {[type]} values [description]
     * @return {[type]}        [description]
     */
    Faze.fn.similarity = function( array, values ) {
      return array.filter( function( v ) {
        return values.includes( v );
      });
    }

    /**
     * [sortedIndex description]
     * @param  {[type]} array [description]
     * @param  {[type]} n     [description]
     * @return {[type]}       [description]
     */
    Faze.fn.sortedIndex = function( array, n ) {
      var isDescending = array[0] > array[ array.length - 1 ];
      var index = array.findIndex( function( el ) {
        return ( isDescending ? n >= el : n <= el );
      });
      return index === -1 ? array.length : index;
    }


    // Objects ============================================
    /**
     * [compare description]
     * @param  {[type]} object   [description]
     * @param  {[type]} propname [description]
     * @return {[type]}          [description]
     */
    Faze.fn.compare = function( object, propname ) {
      return object.sort( function( a, b ) {
        return a[propname].toLowerCase() == b[propname].toLowerCase() ? 0 : a[propname].toLowerCase() < b[propname].toLowerCase() ? -1 : 1;
      }); 
    }

    /**
     * [print_r description]
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    Faze.fn.print_r = function( object ) {
      return JSON.stringify( object, null, '\t' ).replace( /\n/g, '<br/>' ).replace( /\t/g, '&nbsp;&nbsp;&nbsp;' );
    }

    // Helper ========================================
    /**
     * [getType description]
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    Faze.fn.getType = function( val ) {
      return val === undefined ? 'undefined' : val === null ? 'null' : val.constructor.name.toLowerCase();
    }

    /**
     * [extend description]
     * @param  {[type]} obj [description]
     * @param  {[type]} src [description]
     * @return {[type]}     [description]
     */
    Faze.fn.extend = function( obj, src ) {
      if( this.nodes && this.lenth ) {
        for( let key in this.nodes ) {
          if( this.nodes.hasOwnProperty( key ) ) {
            obj[key] = this.nodes[key];
          }
          return Faze( obj );
        }
      }
      else if( src ) {
        for( let key in src ) {
          if( src.hasOwnProperty( key ) ) {
            obj[key] = src[key];
          }
          return Faze( obj );
        }
      }
      return this;
    }

    /**
     * [is description]
     * @param  {[type]}  type [description]
     * @param  {[type]}  val  [description]
     * @return {Boolean}      [description]
     */
    Faze.fn.is = function( type, val ) {
      return !['',null].includes( val ) && val.constructor === type;
    }

    /**
     * [functionExists description]
     * @param  {[type]} functionName [description]
     * @return {[type]}              [description]
     */
    Faze.fn.functionExists = function( functionName ) {
      return typeof functionName == 'function';
    }

    /**
     * [getCookie description]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    Faze.fn.getCookie = function( name ) {
      var v = document.cookie.match( '(^|;) ?' + name + '=([^;]*)(;|$)' );
      return v ? v[2] : null;
    }

    /**
     * [setCookie description]
     * @param {[type]} name  [description]
     * @param {[type]} value [description]
     * @param {[type]} days  [description]
     */
    Faze.fn.setCookie = function( name, value, days ) {
      var d = new Date;
      d.SetTime( d.getTime() + 24 * 60 * 60 * 1000 * days );
      document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
    }

    Faze.fn.deleteCookie = function( name ) {
      this.setCookie( name, '', -1 );
    }

    /**
     * [add description]
     * @param {[type]} option [description]
     */
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

    /**
     * [attr description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    Faze.fn.attr = function( options ) {
      if( !options ) {
        this.each( function( item ) {
          return item.attributes;
        });
      }
    }

    /**
     * [clone description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    Faze.fn.clone = function( options ) {
      var elems = [];
      this.each( function( item ) {
        elems.push( item.clone( options ) );
      });
      return elems;
    }

    /**
     * [html description]
     * @return {[type]} [description]
     */
    Faze.fn.html = function() {
      var str = '';
      this.each( function( item ) {
        str += item.outerHTML;
      });
      return str;
    }

    /**
     * [text description]
     * @return {[type]} [description]
     */
    Faze.fn.text = function() {
      var str = this.html();
      return str.replace( /<[^>]*>/gm, '' );  
    }

    /**
     * [isNumeric description]
     * @param  {[type]}  number [description]
     * @return {Boolean}        [description]
     */
    Faze.fn.isNumeric = function( number ) {
      if( !( typeof number === "string" ) && !( typeof number === "number" )  ) {
        return false;
      }
      return number.match( /^[\d.]+?/ );
    }

    /**
     * [attempt description]
     * @param  {Function}  fn   [description]
     * @param  {...[type]} args [description]
     * @return {[type]}         [description]
     */
    Faze.fn.attempt = function( fn, ...args ) {
      try{
        return fn( ...args );
      }
      catch( e ) {
        return e instanceof Error ? e : new Error( e );
      }
    }

    /**
     * [wrap description]
     * @param  {[type]} html [description]
     * @return {[type]}      [description]
     */
    Faze.fn.wrap = function( html ) {
      var wrapper = createNodes( html );

      this.each( function( item ) {
        item.parentNode.insertBefore( wrapper, item );
        wrapper.appendChild( item );  
      });
    }

    /**
     * [poll description]
     * @param  {Function} fn       [description]
     * @param  {[type]}   timeout  [description]
     * @param  {[type]}   interval [description]
     * @return {[type]}            [description]
     */
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

    /**
     * [once description]
     * @param  {Function} fn      [description]
     * @param  {[type]}   context [description]
     * @return {[type]}           [description]
     */
    Faze.fn.once = function( fn, context ) {
      var result;

      return function() {
        if( fn ) {
          result = fn.apply( context || this, arguments );
        }

        return result;
      }
    }

    /**
     * [throttle description]
     * @param  {Function} fn   [description]
     * @param  {[type]}   wait [description]
     * @return {[type]}        [description]
     */
    Faze.fn.throttle = function( fn, wait ) {
      var inThrottle, lastFn, lastTime;
      return function() {
        var context = this, args = arguments;
        if( !inThrottle ) {
          fn.apply( context, args );
          lastTime = Date.now();
          inThrottle = true;
        }
        else {
          clearTimeout( lastFn );
          lastFn = setTimeout( function() {
            if( Date.now() - lastTime >= wait ) {
              fn.apply( context, args );
              lastTime = Date.now();
            }
          }, Math.max( wait - ( Date.now() - lastTime ), 0 ) );
        }
      };
    };

    /**
     * [debouce description]
     * @param  {[type]} func      [description]
     * @param  {[type]} wait      [description]
     * @param  {[type]} immediate [description]
     * @return {[type]}           [description]
     */
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

    // Traversing =====================================
    Faze.fn.parent = function() {
      var newNodes = [];
      this.each( function( item ) {
        var parent = item.parentNode;
        newNodes.push( parent );
      });
      return Faze( newNodes );
    }

    /**
     * [children description]
     * @return {[type]} [description]
     */
    Faze.fn.children = function() {
      var children = [];
      this.each( function( item ) {
        if( item.hasChildNodes() ) {
          children.push( this.makeArray( item.children ) );
        }
      });

      return new Faze( children );
    }

    /**
     * [remove description]
     * @return {[type]} [description]
     */
    Faze.fn.remove = function() {
      if( this.nodes ) {
        this.each( function( item ) {
          if( item instanceof HTMLElement ) {
            item.parentNode.removeChild( item );
          }
        });
      }
      return this;
    }



    // Faze.fn.sibling = function( filter ) { // TODO:
    //   var newNodes = [];

    // }
    
    // Faze.fn.closest = function(  )

    // Date ===========================================
    /**
     * [dayOfYear description]
     * @param  {[type]} date [description]
     * @return {[type]}      [description]
     */
    Faze.fn.dayOfYear = function( date ){
      return Math.floor( ( date - new Date( date.getFullYear(), 0, 0 ) ) / 1000 / 60 / 60 / 24 );
    }

    return new Faze();
})();