fz().domReady( function() {

  particlesJS.load( 'particle-js', 'particles.json', function() {
    console.log( 'callback' );
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