fz().domReady( function() {

  particlesJS.load( 'particle-js', 'particles.json', function() {
    if( window.console ) {
    	console.log( 'Particles JSON loaded correctly' );
    }
  });

  fz('.navigation').on( 'click', function(e) {
  	fz( '.perspective' ).toggleClass( 'animate' );
  	fz( '.perspective' ).toggleClass( 'modelview' );
  });

 fz( document ).on( 'click', function(e) {
 		console.log( 'test' );
  	fz( '.perspective' ).toggleClass( 'animate' );
  	fz( '.perspective' ).toggleClass( 'modelview' );
 }, '.perspective.modelview' );

});