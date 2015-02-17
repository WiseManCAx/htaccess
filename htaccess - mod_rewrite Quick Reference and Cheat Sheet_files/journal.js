var j = {
	
	start: function() {
		j.setupForm();
	},
	
	setupForm: function() {
		$( 'comment_form' ).set( 'send', {
			url: 'ajax.php?mode=AJAX&page=comment',
			method: 'post',
			onSuccess: function( json ){
				var res = JSON.decode( json );
				if( res.status == 'success' ) {
					var parentEl = ( res.parent == 0 ) ? $( 'comments_area' ) : $( 'comment-' + res.parent );
					if( res.parent > 0 ) {
						var scrollTo = $( 'comment-' + res.parent );
						new Fx.Scroll( window ).toElement( scrollTo );
					}
					var comment_holder = new Element( 'div', {
						'opacity': 0,
						'html': res.html
					} ).inject( parentEl );
					var fadeFx = new Fx.Tween( comment_holder, { duration: 800, transition: Fx.Transitions.Quint.easeOut } );
					(function() { fadeFx.start( 'opacity', 0, 1 ); } ).delay( 1000 );
					$( 'post_comment' ).setProperty( 'disabled', 'disabled' );
				}
				else
					alert( res.message );
			},
			onFailure: function(){
				alert( 'There was an error and your comment was not sent' );
			}
		} );

		
		$( 'post_comment' ).addEvent( 'click', function() {
			$( 'comment_form' ).send();
			return false;
		} );
	},
	
	replyTo: function( id ) {
		$( 'reply_to' ).setProperty( 'value', id );
		if( s.IEVersion > 5 )
			new Fx.Scroll(window).toBottom();
		else
			new Fx.Scroll( window ).toElement( 'post_comment' );
	}
}

window.addEvent( 'domready', j.start );
