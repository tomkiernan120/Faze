(() => {

    const domReadyStack = [];

    const isSimple = /^.[^:#[.,]*$/;
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

    const defaults = {
      version: '[VERSION]'
    };

    /**
     * [Faze instance constructor]
     * @param {Faze} selector [description]
     */
    const Faze = function( selector ) {

      if( !(this instanceof Faze) ) {
        return new Faze( selector );
      }

      if( !selector ){
        return;
      }

      const extended = {};

      for( const prop in defaults ) {
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
        for( let i = 0; i < this.nodes.length; i++ ) {
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
      const div = document.createElement( 'div' );
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

    // const isTravisCI = () => 'TRAVIS' in process.env && 'CI' in process.env;

    /**
     * [check if object is array like]
     * @param  {[type]}
     * @return {Boolean}
     */
    function isLikeArray( obj ) {
      const length = !!obj && obj.length;
      const type = toType( obj );
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
        return `${obj}`;
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
      for( let i = 0; i < this.length; i++ ) {
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
      this.each( ({classList}) => {
        classList.add( classname );
      }); 
      return this;
    } 



    /**
     * [Remove class from DOM Elements]
     * @param  {[type]} classname [description]
     */
    Faze.fn.removeClass = function( classname ) {
      this.each( ({classList}) => {
        classList.remove( classname );
      });
      return this;
    }

    /**
     * [add or remove classname from DOM Elements]
     * @param  {[string]} classname [description]
     */
    Faze.fn.toggleClass = function( classname ) {
      this.each( function({classList}) {
        if( classList.contains( classname ) ) {
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
      let hasClass = false;
      const useMatch = classname.split( /[.#:~*]/ ).length > 1 ? true : false;
      this.each( item => {
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
        this.each( ({style}) => {
          if( null !== style[opt1] ) {
            style[opt1] = opt2;
          }
        });
      }
      else if( typeof opt1 === "object" ) {
        this.each( ({style}) => {
          Faze( opt1 ).each( ( option, index ) => {
            style[index] = option[index];
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
    Faze.fn.changeColour = (color, ammount) => {
      let useHash = false;

      if( color[0] === '#' ) {
        color = color.slice( 1 );
        useHash = true;
      }

      const num = parseInt( color, 16 );

      let r = ( num >> 16 ) + ammount;

      if( r > 255 ) {
        r = 255;
      }
      else if( r < 0 ) {
        r = 0;
      }

      let b = (( num >> 8 ) & 0x00FF ) + ammount;

      if( b > 255 ) {
        b = 255; 
      }
      else if( b < 0 ) {
        b = 0;
      }

      let g = (num & 0x0000FF) + ammount;

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
    Faze.fn.trim = string => string.replace( /\s+/g, '' )

    /**
     * [Return size of string in bytes]
     * @param  {[string]} string 
     * @return {[integer]}        [bytes of string]
     */
    Faze.fn.byteSize = string => new Blob([ string ]).size

    /**
     * [Capitalize string]
     * @param  {[string]} string    
     * @param  {[boolean]} lowerRest [set all other characters to lowercase]
     * @return {[string]}           
     */
    Faze.fn.capitalize = ( string, lowerRest ) => string[0].toUpperCase() + ( lowerRest ? string.substr( 1 ).toLowerCase() : string.substr( 1 ) )

    /**
     * [Capitalize each word]
     * @param  {[type]} string [description]
     * @return {[type]}        [description]
     */
    Faze.fn.capitalizeWords = string => string.replace( /\b[a-z]/g, char => char.toUpperCase() )

    /**
     * [DeCapitalize string]
     * @param  {[string]} string   
     * @param  {[boolean]} upperRest [Set all other characters to uppercase]
     * @return {[string]}           [Return decapitalised string]
     */
    Faze.fn.deCapitalize = ( string, upperRest ) => string[0].toLowerCase() + ( upperRest ? string.substr( 1 ).toUpperCase() : string.substr( 1 ) )

    /**
     * Simple string validation for CSV
     * @param {String} string String to validate
     * @return {Boolean}
     */
    Faze.fn.validateCSV = function( string ) {
      return string.match( /"[^"]*"|'[^'\r\n]*'|[^;\r\n]*/g );
    }

    /**
     * [Convert CSV string to array]
     * @param  {[string]} data          [CSV string]
     * @param  {[type]} delimiter     [description]
     * @param  {[type]} onmitFirstRow [description]
     * @return {[type]}               [description]
     */
    Faze.fn.csvToArray = function( data, delimiter, onmitFirstRow ) {
      if( this.validateCSV( data ) ){
        return data.slice( onmitFirstRow ? data.indexOf('\n') + 1 : 0 ).split( '\n' ).map(  v => v.split( delimiter ? delimiter : ',' ) )
      }
      else {
        throw new Error( 'Could not verify CSV string' );
      }
    }

    Faze.fn.csvToJSON = function(data, delimiter = ',') {
      if( !this.validateCSV ){
        throw new Error( 'Could not verify CSV string' );
      }
      const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
      return data
        .slice(data.indexOf('\n') + 1)
        .split('\n')
        .map(v => {
          const values = v.split(delimiter);
          return titles.reduce((obj, title, index) => ((obj[title] = values[index]), obj), {});
        });
    }

    /**
     * [escape HTML string for output to client]
     * @param  {[string]} string [HTML risky string]
     * @return {[string]}        [returned string with all html elements escaped]
     */
    Faze.fn.escapeHTML = string => string.replace( /[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' } [tag] || tag))

    /**
     * Convert camel case to seperated
     * @param  {string} string    
     * @param  {string} seperator seperator you with to use between words (Defaults: _)
     * @return {string}           seperated string
     */
    Faze.fn.fromCamelCase = (string, seperator) => string.replace( /([a-z\d])([A-Z])/g, `$1${seperator ? seperator : '_'}$2` ).replace( /([A-Z]+)([A-Z][a-z\d]+)/g, `$1${seperator ? seperator : '_'}$2` ).toLowerCase()

    /**
     * Indet string at every start of new line
     * @param  {string} string 
     * @param  {interget} count  ammount of lines to indent
     * @param  {string} indent string to use for indent
     * @return {string}        Indented String
     */
    Faze.fn.indentString = (string, count, indent) => string.replace( /^/gm, ( indent ? indent : ' ' ).repeat( count ) )

    /**
     * Check if 1 word is an anagram of another
     * @param  {string}  str1 word to check
     * @param  {string}  str2 word to check against
     * @return {boolean}      
     */
    Faze.fn.isAnagram = (str1, str2) => {
      const normalize = str => {
        str.toLowerCase().replace( /[^a-z0-9]/gi, '' ).split('').sort().join('');
      };
      return normalize( str1 ) === normalize( str2 );
    }

    /**
     * Check if string is lowercase
     * @param  {string}  str 
     * @return {Boolean}    
     */
    Faze.fn.isLowerCase = str => str === str.toLowerCase()

    /**
     * Check if string is uppercase
     * @param  {string}  str 
     * @return {Boolean}
     */
    Faze.fn.isUpperCase = str => str === str.toUpperCase()

    /**
     * Run function on every character of a string
     * @param  {string}   str 
     * @param  {Function} fn  function callback for each character
     * @return {string}       Edited string
     */
    Faze.fn.mapString = (str, fn) => str.split( '' ).map( (c, i) => fn( c, i, str )).join('')

    /**
     * Mask a number of characters of a string
     * @param  {string} cc   string to mask
     * @param  {interger} num  Number of characters to maske
     * @param  {string} mask character to use as a mask (Defaults to '*')
     * @return {string}      
     */
    Faze.fn.mask = (cc, num, mask) => cc.slice( - ( num ? num : 4 ) ).padStart( cc.length, ( mask ? mask : '*' ) )

    /**
     * Pad a string
     * @param  {string} str    
     * @param  {integer} length desired length of string
     * @param  {string} char   String to use as padding (Defaults to ' ')
     * @return {string}        Padded string
     */
    Faze.fn.pad = (str, length, char) => str.padStart( ( str.length + length ) / 2, ( char ? char : ' ' ) ).padEnd( length, ( char ? char : ' ' ) )

    /**
     * Pluralize value
     * @param  {string} val    String to pluralize
     * @param  {[type]} word   [description]
     * @param  {[type]} plural [description]
     * @return {[type]}        [description]
     */
    Faze.fn.pluralize = (val, word, plural = `${word}s`) => {
      const _pluralize = (num, word, plural) => [ 1, -1 ].includes( Number( num ) ) ? word : plural;
      if( typeof val === 'object' ) {
        return (num, word) => _pluralize( num, word, val[word] );
      }
      return _pluralize( val, word, plural );
    }

    /**
     * Remove non ASCII characters from string 
     * @param  {string} string 
     * @return {string}        String without ASCII characters
     */
    Faze.fn.removeNonASCII = string => string.replace( /[^\x20-\x7E]/g, '' )

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
        return array.includes(value);
      }
      else if( this.isArray() ) {
        return this.nodes.includes(value); 
      }
      return false;
    } 

    /**
     * [merge description]
     * @param  {[type]} array1 [description]
     * @param  {[type]} array2 [description]
     * @return {[type]}        [description]
     * @todo merge needs a lot more functionality
     * @body Need to really look at what options are set within the Faze object and really check what can be merged, basically needs to be alot more extensive, very open to ideas and suggestions
     */
    Faze.fn.merge = (array1, array2) => { // TODO: needs way more and to be way cleverer that this rubbish
      const newArray = [];

      for( let i = 0; i < array2.length; i++ ) {
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
      const ret = [];
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
        return this.nodes.sort( (a, b) => a.toString().toLowerCase().localeCompare( b.toString().toLowerCase() ));
      }
      else {
        return array.sort( (a, b) => a.toString().toLowerCase().localeCompare( b.toString().toLowerCase() ));
      }
    }

    /**
     * [random description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    Faze.fn.random = function( array ) {
      if( this.nodes ) {
        return this.nodes[ Math.floor( Math.random() * this.nodes.length ) ];
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
      if( this.nodes ) {
        return this.nodes.every( val => val === this.nodes[0] );
      }
      return array.every( val => val === array[0] );
    }

    /**
     * [any description]
     * @param  {[type]}   array [description]
     * @param  {Function} fn    [description]
     * @return {[type]}         [description]
     */
    Faze.fn.any = function(array, fn) {
      if( !fn ) {
        fn = Boolean;
      }
      if( !array && this.nodes ){
        array = this.nodes;
      }
      return array.some( fn );
    }

    /**
     * [arrayToCSV description]
     * @param  {[type]} array     [description]
     * @param  {[type]} delimiter [description]
     * @return {[type]}           [description]
     */
    Faze.fn.arrayToCSV = function(delimiter, array) {
      if( this.nodes && !array ) {
        array = this.nodes;
      }
      const CSV = array.map( value => value.map( x => ( isNaN( x ) ? `"${x.replace( /"/g, '""' )}"` : x ) ).join( delimiter ? delimiter : ',' ) ).join( '\n' ); 
      if( this.validateCSV( CSV ) ) {
        return CSV;
      }
      return null;
    }

    /**
     * [chunk description]
     * @param  {[type]} array [description]
     * @param  {[type]} size  [description]
     * @return {[type]}       [description]
     */
    Faze.fn.chunk = function (size, array) {
      if( !size ) {
        throw new Error( 'Specify a chunk size' );
      }
      if( this.nodes && !array ){
        array = this.nodes;
      }
      return Array.from({ length: Math.ceil( array.length / size ) }, (v, i) => array.slice( i * size, i * size, + size ));
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
    Faze.fn.difference = (a, b) => {
      const s = new Set( b );
      return a.filter( x => !s.has( x ));
    }

    /**
     * [differenceBy description]
     * @param  {[type]}   a  [description]
     * @param  {[type]}   b  [description]
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    Faze.fn.differenceBy = (a, b, fn) => {
      const s = new Set( b.map( fn ) );
      return a.map( fn ).filter( el => !s.has( el )); 
    }

    /**
     * [fitlerNonUnique description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    Faze.fn.fitlerNonUnique = function(array) {
      if( this.nodes && !array ) {
        array = this.nodes;
      }
      return array.filter( i => array.indexOf( i ) === array.lastIndexOf( i ) )
    }

    /**
     * [findLast description]
     * @param  {[type]}   array [description]
     * @param  {Function} fn    [description]
     * @return {[type]}         [description]
     */
    Faze.fn.findLast = function(fn, array) { 
      if( this.nodes && !array ){
        array = this.nodes;
      }
      return array.filter( fn ).pop()
    }

    /**
     * [findLastIndex description]
     * @param  {[type]}   array [description]
     * @param  {Function} fn    [description]
     * @return {[type]}         [description]
     */
    Faze.fn.findLastIndex = function(fn, array) {
      if( this.nodes && !array ) {
        array = this.nodes;
      } 
      return array.map( (val, i) => [ i, val ]).filter( (i, val) => fn( val, i, array )).pop()[0]
    }

    /**
     * [head description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    Faze.fn.head = function( array ) { 
      if( !array && this.isArray( this.nodes ) &&  this.nodes ) {
        array = this.nodes;
      }
      return array[0] 
    }

    /**
     * [shuffle description]
     * @param  {...[type]} array [description]
     * @return {[type]}          [description]
     */
    Faze.fn.shuffle = function (...array) {
      if( this.nodes && (!this.isArray( array ) || !array.length) ) {
        array = this.nodes;
      }
      let m = array.length;
      while( m ) {
        const i = Math.floor( Math.random() * m-- );
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
    Faze.fn.similarity = function( values, array ) {
      if( !values ){
        throw new Error( 'Please specify an array values' );
      } 
      if( this.nodes && !array ){
        array = this.nodes;
      }
      return array.filter( v => values.includes( v ))
    }

    /**
     * Returns the lowest index at which value should be inserted into array in order to maintain its sort order.
     * @param  {[type]} array [description]
     * @param  {[type]} n     [description]
     * @return {[type]}       [description]
     */
    Faze.fn.sortedIndex = function(n, array) {
      if( this.nodes && !array ) {
        array = this.nodes;
      }
      const isDescending = array[0] > array[ array.length - 1 ];
      const index = array.findIndex( el => isDescending ? n >= el : n <= el);
      return index === -1 ? array.length : index;
    }


    // Objects ============================================
    /**
     * [compare description]
     * @param  {[type]} object   [description]
     * @param  {[type]} propname [description]
     * @return {[type]}          [description]
     */
    // Faze.fn.compare = function( object, propname ) {
    //   return this.is( Object, object ) ? 
    //     object.sort( (a, b) => a[propname].toLowerCase() == b[propname].toLowerCase() ? 0 : a[propname].toLowerCase() < b[propname].toLowerCase() ? -1 : 1) : 
    //     null;
    // }

    /**
     * [print_r description]
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    Faze.fn.print_r = object => JSON.stringify( object, null, '\t' ).replace( /\n/g, '<br/>' ).replace( /\t/g, '&nbsp;&nbsp;&nbsp;' ).replace( /"/g, "\\\"" );

    // Helper ========================================
    /**
     * [getType description]
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    Faze.fn.getType = val => val === undefined ? 'undefined' : val === null ? 'null' : val.constructor.name.toLowerCase()

    /**
     * [extend description]
     * @param  {[type]} obj [description]
     * @param  {[type]} src [description]
     * @return {[type]}     [description]
     * @todo Need to create a unit test
     * @body Need to create a QUnit unit test, not quite sure how to test.
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
     * Checks if the provided value is of the specified type.
     * @param  {[type]}  type [description]
     * @param  {[type]}  val  [description]
     * @return {Boolean}      [description]
     */
    Faze.fn.is = function(type, val) { 
     return ![, null].includes(val) && val.constructor === type;
   }

    /**
     * [functionExists description]
     * @param  {[type]} functionName [description]
     * @return {[type]}              [description]
     */
    Faze.fn.functionExists = functionName => typeof functionName == 'function'

    /**
     * [getCookie description]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     * @todo Not quite sure how to test
     * @body need to check if cookie exists, also may need to check if browser incase we want to allow for node use.
     */
    Faze.fn.getCookie = name => { 
      const v = document.cookie.match( `(^|;) ?${name}=([^;]*)(;|$)` );
      return v ? v[2] : null;
    }

    /**
     * [setCookie description]
     * @param {[type]} name  [description]
     * @param {[type]} value [description]
     * @param {[type]} days  [description]
     * @todo Needs test
     * @body Needs unit test, and maybe browser check
     */
    Faze.fn.setCookie = (name, value, days) => { 
      if( !name && name === '' ) {
        throw new Error( 'Please specify the name of the cookie' );
      }

      if( !value ){
        throw new Error( 'Please enter a value of the cookie' ); 
      }

      const d = new Date();
      if( !days ) {
        days = 30;
      }
      d.setTime( d.getTime() + 24 * 60 * 60 * 1000 * days );
      document.cookie = `${name}=${value};path=/;expires=${d.toGMTString()}`;
      return document.cookie;
    }

    /**
     * [deleteCookie description]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     * @todo Needs test
     * @body Needs unit test, and maybe browser check
     */
    Faze.fn.deleteCookie = function( name ) { 
      this.setCookie( name, '', -1 );
    }

    /**
     * [add description]
     * @param {[type]} option [description]
     * @todo Needs test
     * @body Needs unit testing
     */
    Faze.fn.add = function( option ) {

      console.log( option );

      console.log( typeof option );

      if( option instanceof HTMLElement  ) {
        this[this.length+1] = HTMLElement;
      }
      else if( option instanceof NodeList ) {
        const list = this.merge( this.nodes, NodeList );
        for( let i = 0; i < list.length; i++ ) {
          this[this.length+1] = list[i];
        }
      }
      else if( option instanceof Object ) {
        this[ this.length + 1 ] = option;
        this.extend( this, option );
      }
    }

    /**
     * [attr description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     * @todo Needs unit test
     * @body Needs a good unit test
     */
    Faze.fn.attr = function( options ) { 
      if( !options ) {
        this.each( ({attributes}) => attributes);
      }
    }

    /**
     * [clone description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     * @todo Needs unit test
     * @body This needs a unit test
     * @todo Needs more though
     * @body Might need more thought about checks and wether it should return a new Faze object or not.
     */
    Faze.fn.clone = function( options ) { 
      const elems = [];
      this.each( item => {
        elems.push( [item.clone( options )] );
      });
      return elems;
    }

    /**
     * [html description]
     * @return {[type]} [description]
     * @todo Needs Unit Test
     * @body Needs unit testing
     */
    Faze.fn.html = function() {
      let str = '';
      this.each( ({outerHTML}) => {
        str += outerHTML;
      });
      return str;
    }

    /**
     * [text description]
     * @return {[type]} [description]
     * @todo Needs Unit Test
     * @body Needs unit testing
     */
    Faze.fn.text = function() {
      const str = this.html();
      return str.replace( /<[^>]*>/gm, '' );  
    }

    /**
     * [isNumeric description]
     * @param  {[type]}  number [description]
     * @return {Boolean}        [description]
     */
    Faze.fn.isNumeric = number => {
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
     * @todo Needs Unit Test
     * @body Needs unit testing
     */
    Faze.fn.attempt = (fn, ...args) => {
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
     * @todo Needs Unit Test
     * @body Needs unit testing
     */
    Faze.fn.wrap = function( html ) {
      const wrapper = createNodes( html );

      this.each( item => {
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
     * @todo Needs Unit Test
     * @body Needs unit testing
     */
    Faze.fn.poll = (fn, timeout, interval) => {
      const endTime = Number( new Date() ) + ( timeout || 2000 );
      interval = interval || fn();
      const checkCondition = function( resolve, reject ) {
        const result = fn();
        if( result ) {
          resolve( result );
        }
        else if( Number( new Date() ) < endTime ) {
          setTimeout( checkCondition, interval, resolve, reject );
        }
        else {
          reject( new Error( `Timed out for ${fn}: ${arguments}` ) );
        }
      };

      return new Promise( checkCondition );
    }

    /**
     * [once description]
     * @param  {Function} fn      [description]
     * @param  {[type]}   context [description]
     * @return {[type]}           [description]
     * @todo Needs Unit Test
     * @body Needs unit testing
     */
    Faze.fn.once = (fn, context) => {
      let result;

      return function(...args) {
        if( fn ) {
          result = fn.apply( context || this, args );
        }

        return result;
      };
    }

    /**
     * [throttle description]
     * @param  {Function} fn   [description]
     * @param  {[type]}   wait [description]
     * @return {[type]}        [description]
     * @todo Needs Unit Test
     * @body Needs unit testing
     */
    Faze.fn.throttle = (fn, wait) => {
      let inThrottle;
      let lastFn;
      let lastTime;
      return function() {
        const context = this;
        const args = arguments;
        if( !inThrottle ) {
          fn.apply( context, args );
          lastTime = Date.now();
          inThrottle = true;
        }
        else {
          clearTimeout( lastFn );
          lastFn = setTimeout( () => {
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
     * @todo Needs Unit Test
     * @body Needs unit testing
     */
    Faze.fn.debouce = (func, wait, immediate) => {
      let timeout;
      return function() {
        const context = this;
        const args = arguments;
        const later = () => {
          timeout = null;
          if( !immediate ) {
            func.apply( context, args );
          }
        };
        const callNow = immediate && !timeout;
        clearTimeout( timeout );
        timeout = setTimeout( later, wait );
        if( callNow ) {
          func.apply( context, args );
        }
      };
    }

    // Traversing =====================================
    /**
     * [parent description]
     * @return {[type]} [description]
     * @todo Needs Unit Test
     * @body Needs unit testing
     * @todo Needs better docblock
     * @body needs a better docblock setting up more description
     */
    Faze.fn.parent = function() {
      const newNodes = [];
      this.each( ({parentNode}) => {
        const parent = parentNode;
        newNodes.push( parent );
      });
      return Faze( newNodes );
    }

    /**
     * [children description]
     * @return {[type]} [description]
     * @todo Needs Unit Test
     * @body Needs unit testing
     * @todo Needs better docblock
     * @body needs a better docblock setting up more description
     */
    Faze.fn.children = function() {
      const children = [];
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
     * @todo Needs Unit Test
     * @body Needs unit testing
     * @todo Needs better docblock
     * @body needs a better docblock setting up more description
     */
    Faze.fn.remove = function() {
      if( this.nodes ) {
        this.each( item => {
          if( item instanceof HTMLElement ) {
            item.parentNode.removeChild( item );
          }
        });
      }
      return this;
    }

    /**
     * [description]
     * @return {[type]} [description]
     * @todo Needs Unit Test
     * @body Needs unit testing
     * @todo Needs better docblock
     * @body needs a better docblock setting up more description
     */
    Faze.fn.empty = () => {
      this.each( item => {
        if( item instanceof HTMLElement ) {
          item.innerHTML = '';
        }
      });
      return this;
    }

    /**
     * [memoize description]
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     * @todo Needs Unit Test
     * @body Needs unit testing
     * @todo Needs better docblock
     * @body needs a better docblock setting up more description
     */
    Faze.fn.memoize = function( fn ) {
      const cache = new Map();
      const cached = function( val ) {
        return cache.has( val ) ? cache.get( val ) : cache.set( val, fn.call( this, val ) ) && cache.get( val ); 
      };
      cached.cache = cache;
      this.cache.push( cached );
      return cached;
    }

    /**
     * @todo Set up a function to find sibling
     * @body Build a function to find the selected Faze objects siblings
     */
    // Faze.fn.sibling = function( filter ) { // TODO:
    //   var newNodes = [];

    // }
    
    /**
     * @todo Setup function to find closest
     * @body Build a function to find the closest 'x' object to Faze selected objects
     */
    // Faze.fn.closest = function(  )

    // Date ===========================================
    /**
     * [dayOfYear description]
     * @param  {[type]} date [description]
     * @return {[type]}      [description]
     * @todo Needs Unit Test
     * @body Needs a QUnit Unit test
     */
    Faze.fn.dayOfYear = date => Math.floor( ( date - new Date( date.getFullYear(), 0, 0 ) ) / 1000 / 60 / 60 / 24 ) //TODO: not too sure how to test

    /**
     * [timeSince description]
     * @param  {[type]} date [description]
     * @return {[type]}      [description]
     * @todo Needs Unit Test
     * @body Needs unit testing
     * @todo Needs better docblock
     * @body needs a better docblock setting up more description
     */
    Faze.fn.timeSince = function( date ) { //TODO: not too sure how to test
      if( this.isFuture( date ) ) {
        throw new Error( 'the date specified must be a past date' );
      }
      var seconds = Math.floor( ( new Date() - date ) / 1000 );
      var interval = Math.floor( seconds / 31546000 );

      if( interval > 1 ) {
        return interval + " years";
      } 

      interval = Math.floor( seconds / 2592000 );

      if( interval > 1 ) {
        return interval + " months";
      }

      interval = Math.floor( seconds / 86400 );

      if( interval > 1 ) {
        return interval + " days";
      }

      interval = Math.floor( seconds / 3600 );

      if( interval > 1 ) {
        return interval + " hours";
      }

      interval = Math.floor( seconds / 60 );

      if( interval > 1 ) {
        return interval + " minutes";
      }

      return Math.floor( seconds ) + " seconds";
    }

    Faze.fn.isFuture = function( value ) {
      var now = new Date;
      var target = new Date( value );
      return now < target;
    }

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
              if( e.target && Faze( e.target ).hasClass( selector ) ) {
                callback.call( this, e );
              }
            });
          }
        });

      }
    }

    /**
     * @todo Plugin extender
     * @body Think about ways and means of creating a plugin extension api
     */

    return new Proxy( {}, new Faze());
})();