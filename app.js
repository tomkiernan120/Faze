fz().domReady( function() {

  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  if (window.location.hash && isChrome) {
    setTimeout(function () {
      var hash = window.location.hash;
      window.location.hash = "";
      window.location.hash = hash;
    }, 300);
  }

  particlesJS.load( 'particle-js', 'particles.json', function() {
    if( window.console ) {
      console.log( 'Particles JSON loaded correctly' );
    }
  });

  fz('.navigation').on( 'click', function(e) {
    fz( '.perspective' ).toggleClass( 'animate' );
    fz( '.perspective' ).toggleClass( 'modelview' );
    fz( '.navigation' ).toggleClass( 'active' );
  });

  fz( document ).on( 'click', function(e) {
    fz( '.perspective' ).toggleClass( 'animate' );
    fz( '.perspective' ).toggleClass( 'modelview' );
    fz( '.navigation' ).toggleClass( 'active' );
  }, '.perspective.modelview' );

  fz( '.outer-nav a' ).on( 'click', function(e) {
    e.preventDefault();
    var fzthis = fz( this );

    if( this.href ) {
      window.location.hash = '';
      window.location.hash = this.getAttribute( 'href' );
      window.location.reload();
    }
  });

  var header = document.querySelector( 'header' );

  if( header ) {
    Sticky.init( header );
  }

});
var Sticky = (function(){
  'use strict';

  var CSS_CLASS_ACTIVE = "is-fixed";

  var Sticky = {
    element: null,
    position: 0,
    addEvents: function() {
      window.addEventListener( 'scroll', this.onScroll.bind( this ) );
    },
    init: function( element ) {
      this.element = element;
      this.addEvents();
      this.position = element.offsetTop;
      this.onScroll();
    },
    aboveScroll: function() {
      return this.position < window.scrollY;
    },
    onScroll: function( event ) {
      if( this.aboveScroll() ) {
        this.setFixed();
      }
      else {
        this.setStatic();
      }
    },
    setFixed: function() {
      this.element.classList.add( CSS_CLASS_ACTIVE );
      this.element.style.position = 'fixed';
      this.element.style.top = 0;
    },
    setStatic: function() {
      this.element.classList.remove( CSS_CLASS_ACTIVE );
      this.element.style.position = 'static';
      this.element.style.top = 'auto';
    }
  };

  return Sticky;

})();