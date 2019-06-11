fz().domReady( function() {

  particlesJS.load( 'particle-js', 'particles.json', function() {
    console.log( 'callback' );
  });

  fz('.navigation').on( 'click', function(e) {
  	fz( '.perspective' ).toggleClass( 'animate' );
  	fz( '.perspective' ).toggleClass( 'modelview' );
  });

 fz( '.perspective.modelview' ).on( 'click', function(e) {
  	fz( '.perspective' ).toggleClass( 'animate' );
  	fz( '.perspective' ).toggleClass( 'modelview' );
 });

});