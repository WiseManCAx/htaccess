var s = {
	
	start: function() {
		s.ieDetect();
		s.setFont();
		s.setBlob();
		s.loadSH();
		s.textScaler();
		s.setupMenu();
		s.setupButtons();
		s.setupContent();
		s.setupCols();
		s.preloadImages();
	},
	
	ieDetect: function() {
		s.IEVersion = false;
		var rv = -1;
		if ( navigator.appName == 'Microsoft Internet Explorer' ) {
			var ua = navigator.userAgent;
			var re  = new RegExp( "MSIE ([0-9]{1,}[\.0-9]{0,})" );
			if ( re.exec( ua ) != null )
			s.IEVersion = parseFloat( RegExp.$1 );
		}
	},
	
	setFont: function() {
		if( Cookie.read( 'semfont' ) ) {
			var size = Cookie.read( 'semfont' );
			$( 'wrapper' ).setStyle( 'font-size', size + 'px' );
			s.fontSize = size.toFloat();
		}
		else
			s.fontSize = 10;
	},
	
	setBlob: function() {
		var blob = $( 'menu_blob' );
		var active = document.getElement( '#menu_items .current' );
		var cords = active.getCoordinates( $( 'menu_items' ) );
		if( s.IEVersion == 6 | s.IEVersion == 7 )
			s.homeLeft = ( ( cords.left / s.fontSize ) );
		else
			s.homeLeft = ( ( cords.left / s.fontSize ) + ( ( 220 * s.fontSize ) / 10 ) / s.fontSize );
		s.homeWidth = ( ( cords.width / s.fontSize ) );
		blob.setStyles( { 'visibility': 'visible', 'width': s.homeWidth + 'em', 'margin-left': s.homeLeft + 'em' } );
	},
	
	loadSH: function() {
		var SHBlocks = document.getElements( 'textarea[name=code]' );
		if( SHBlocks.length > 0 ) {
			new Asset.javascript( ['assets/js/syntaxhighlighter/shCore.js'] );
			new Asset.css( ['assets/css/syntax_highlighter.css'] );
			var included = new Array();
			SHBlocks.each( function( el )
				{
					var elClass = el.getProperty( 'class' );
					if( !included[elClass] ) {
						new Asset.javascript( ['assets/js/syntaxhighlighter/shBrush' + elClass + '.js'] );
						included[elClass] = true;
					}
				}
			);
			new Asset.javascript( ['assets/js/syntaxhighlighter/include.js'] );
		}
	},
	
	textScaler: function() {
		var begin = ( s.fontSize == 10 ) ? 0 : ( s.fontSize - 10 ) * 10;
		new Slider( $( 'scale_area' ), $( 'scale_knob' ), {
			steps: 100,
			onChange: function( pos ) {
				var size = ( ( pos.toInt() / 10 ) + 10 );
				$( 'wrapper' ).setStyle( 'font-size', size + 'px' );
			},
			onComplete: function( pos ) {
				var size = ( ( pos.toInt() / 10 ) + 10 );
				if( Cookie.read( 'semfont' ) )
					Cookie.dispose( 'semfont' );
				Cookie.write( 'semfont', size, { path: '/', duration: 28 } );
				s.fontSize = size;
			}
		} ).set( begin );
	},
	
	setupMenu: function() {
		var blob = $( 'menu_blob' );
		var activeFadeOut = function() {
			var active = document.getElement( '#menu_items .active' );
			var selected = document.getElement( '#menu_items .selected' );
			if( selected ) {
				active.removeClass( 'active' );
				selected.removeClass( 'selected' );
				selected.addClass( 'active' );
			}
			else {
				document.getElements( '#menu_items .active' ).removeClass( 'active' );
				document.getElement( '#menu_items .current' ).addClass( 'active' );
			}
		}
		var blobFx = new Fx.Morph( blob, { fps: 25, duration: 500, transition: Fx.Transitions.Quint.easeOut, unit: 'em', link: 'cancel', onStart: activeFadeOut } );
		
		var menuItems = document.getElements( '#menu_items a' );
		$( 'menu_items' ).addEvent( 'mouseleave', function( event ) {
			blobFx.start( { 'margin-left': s.homeLeft, 'width': s.homeWidth } );
		} );
		menuItems.each( function( item ) {
			item.addEvent( 'mouseenter', function( event ) {
				item.addClass( 'selected' );
				var cords = item.getCoordinates( $( 'menu_items' ) );
				if( s.IEVersion == 6 | s.IEVersion == 7 )
					var left = ( ( cords.left / s.fontSize ) );
				else
					var left = ( ( cords.left / s.fontSize ) + ( ( 220 * s.fontSize ) / 10 ) / s.fontSize );
				var width = ( ( cords.width / s.fontSize ) );
				blobFx.start( { 'width': width, 'margin-left': left } );
			} );
			item.addEvent( 'mouseleave', function( event ) {
				item.removeClass( 'selected' );
			} );
		} );
	},
	
	setupButtons: function() {
		var colours = new Object( { 'green' : 'gold', 'blue' : 'red', 'gold' : 'green', 'red' : 'blue' } );
		var buttons = document.getElements( '.button_styled' );
		if( buttons.length > 0 ) {
			buttons.each( function( button ) {
				button.addEvent( 'mouseenter', function() {
					for( i in colours ) { 
						if( button.hasClass( i ) ) {
							button.removeClass( i ).addClass( colours[i] );
							break;
						}
					};
				} );
				button.addEvent( 'mouseleave', function() {
					for( i in colours ) { 
						if( button.hasClass( i ) ) {
							button.removeClass( i ).addClass( colours[i] );
							break;
						}
					};
				} );
			} );
		}
	},
	
	setupContent: function() {
		var cLft = document.getElement( '.content.page_left' );
		var cRgt = document.getElement( '.content.page_right' );
		if( cLft && cRgt ) {
			var lftHeight = cLft.getStyle( 'height' ).toInt();
			var rgtHeight = cRgt.getStyle( 'height' ).toInt();
			if( rgtHeight > lftHeight ) {
				var newHeight = ( s.IEVersion == 6 | s.IEVersion == 7 ) ? ( ( rgtHeight / s.fontSize ) ) : ( ( rgtHeight / s.fontSize ) + ( ( 40 * s.fontSize ) / 10 ) / s.fontSize );
				cLft.getChildren()[0].setStyle( 'height', newHeight + 'em' );
			}
		}
	},
	
	setupCols: function() {
		var level = new Object( { 0: 0, 1: 0, 2: 0 } );
		var cols = new Object( {
			lft: document.getElements( '#columns .col.lft .item' ),
			cen: document.getElements( '#columns .col.cen .item' ),
			rgt: document.getElements( '#columns .col.rgt .item' )
		} );
		
		if( cols ) {
			for( i in cols ) { 
				cols[i].each( function( item, i ) {
					var height = item.getStyle( 'height' ).toInt();
					if( height > 0 & height > level[i] )
						level[i] = height;
				} );
			}
			for( i in cols ) { 
				cols[i].each( function( item, i ) {
					item.setStyle( 'height', ( ( level[i] + 10 ) / s.fontSize ) + 'em' );
				} );
			}
		}
	},
	
	preloadImages: function() {
		new Asset.images( ['assets/img/sbutton_gold_b.png', 'assets/img/sbutton_gold_bl.png', 'assets/img/sbutton_gold_br.png', 'assets/img/sbutton_gold_c.png', 'assets/img/sbutton_gold_l.png', 'assets/img/sbutton_gold_lu.png', 'assets/img/sbutton_gold_r.png', 'assets/img/sbutton_gold_ru.png', 'assets/img/sbutton_gold_t.png', 'assets/img/sbutton_gold_tl.png', 'assets/img/sbutton_gold_tr.png', 'assets/img/sbutton_red_b.png', 'assets/img/sbutton_red_bl.png', 'assets/img/sbutton_red_br.png', 'assets/img/sbutton_red_c.png', 'assets/img/sbutton_red_l.png', 'assets/img/sbutton_red_lu.png', 'assets/img/sbutton_red_r.png', 'assets/img/sbutton_red_ru.png', 'assets/img/sbutton_red_t.png', 'assets/img/sbutton_red_tl.png', 'assets/img/sbutton_red_tr.png'] );
	}
}

window.addEvent( 'domready', s.start );
