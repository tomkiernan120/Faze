;(function( root, factory ){
  'use strict';

  const PluginName = 'Faze';

  if( typeof define === 'function' && define.amd ) {
    define( [], factory( PluginName ) );
  }
  else if( typeof exports === 'object' ) {
    module.exports = factory( PluginName );
  } 
  else {
    root[ PluginName ] = factory( PluginName );
  }
}( ( window || module || {} ), function( PluginName ) {
  "use strict";

  const plugin = {};

  let defaults = {

  };

  function Plugin( selector, options ) {
    plugin.this = this;
    plugin.name = PluginName;
    plugin.selector = selector;
    plugin.defaults = defaults;
    plugin.options = options;

    plugin.this.initialize();
  };

  const privateMethod = () => {

  };

  Plugin.prototype = {

    initialize: ( silent = false ) => {
      plugin.this.destroySilently();
    },

    destroy: ( silte = false ) => {
      if( !silent ){
        plugin.settings.callbackDestroyBefore.call();
      }

      if( !silent ) {
        plugin.settings.callbackDestroyAfter.call();
      }
    },

    destroySilently: () => {
      plugin.this.destroy( true );
    }

  };

  // var Faze = function( selector, options ) {
  //   console.log( this );
  //   this.options = Object.assign( options || {}, defaults );
  //   this.selector = selector;
  //   this.find();
  // }

  // Faze.prototype.find = () => {}

  // Faze.find = () => {
  //   if( !Faze.selector ) {

  //     // 

  //   }
  // }

  // Faze.extend = ( options, extras = {} ) => { return Object.assign( options, extras ) };

  // Faze.permutations = arr  => { // TODO: fix little bit buggy
  //   console.log( arr.length );
  //   if( arr.length <= 2 ) return arr.length === 2 ? [ arr, [ arr[1], arr[0] ] ] : arr;
  //   return arr.reduce( ( acc, item, i ) => {
  //     acc.concat( Faze.permutations( [ ...arr.slice(0, i), ...arr.slice( i + 1 ) ] ).map( val => [ item, ...val ] ), [] );
  //   })
  // }


  // Faze.donothing = () => {};



  // window.Faze = window.Fz = Faze;

  return Plugin;


}));