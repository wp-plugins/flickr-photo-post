/**
 * This jQuery plugin creates an animated slider with the child elements as frames.
 *
 * @author Justin Jones (justin(at)jstnjns(dot)com)
 * @version 1.1
 *
 * New Features from 1.0:
 * 	- Vertical scrolling
 * 	- Buttons are optional
 * 	- Speed settings
 *
 * Code license: 
 *     - MIT License
 *
 */

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *     This jQuery Plugin was changed for the wordpress Plugin
 *   You can't update it and you can't use it for other projects
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

(function($){
	$.fn.simpleslider = function(settings) {
		
		var defaults = {
			auto: false,
			interval: 2000,
			speed: 500,
			direction: 'horizontal',
			buttons: true,
			autobuttonsize: false,
			previoustext: 'Previous',
			nexttext: 'Next'
			},
			settings = $.extend({}, defaults, settings); 
		
		$(this).each(function() {

			$container = $(this);
			$frame = $container.children().addClass('frame');
			
			$wrapper = $container.wrap('<div id="'+$container.attr('id')+'-wrapper" />').parent('#'+$container.attr('id')+'-wrapper')
			frameCount = $frame.size();
			wrapperHeight = 90; // MJ
			frameHeight = 0;
			
			$frame.each(function() {
				if($(this).height() > frameHeight) frameHeight = $(this).height();
				if($(this).outerHeight(true) > wrapperHeight) wrapperHeight = $(this).outerHeight(true);
			});
			
			// Find frame width
			wrapperWidth = $container.width();
			frameWidth = $frame.width();

			scrollWidth = "546"; // MJ
			
			// Set to first frame
			$.frameNumber = 1;
			$.maxframeNumber = 1;
			// Sets strucural CSS for wrapper
			$wrapper.css({
				width: wrapperWidth,
				height: wrapperHeight,
				overflow: 'hidden'
			});			
			// Set structural CSS for container
			if(settings.direction == 'horizontal') {
				containerWidth = wrapperWidth * frameCount;
				containerHeight = wrapperHeight;
			} else if(settings.direction == 'vertical') {
				containerWidth = wrapperWidth;
				containerHeight = wrapperHeight * frameCount;
			}
			
			$container.css({
				width: 20000, // containerWidth, // MJ
				height: containerHeight
			});
			// Set frames to display correctly
			$frame.css({
				display: 'block',
				float: 'left'
				// height: frameHeight,
				// width: frameWidth
			});
			// Creates buttons
			if(settings.buttons) {
				$wrapper
				.before('<input type="button" id="'+$container.attr('id')+'-previous_button" class="button" value="'+settings.previoustext+'" />')
				.after('<input type="button" id="'+$container.attr('id')+'-next_button" class="button" value="'+settings.nexttext+'" />');
			}
			
			if(settings.autobuttonsize && settings.direction == 'horizontal') {
				$wrapper.parent().find('.button').css({
					height: containerHeight
				});
			} else if(settings.autobuttonsize && (settings.direction == 'vertical')) {
				$wrapper.parent().find('.button').css({
					width: containerWidth
				});
			}

			// Creates buttons functionality
			$('#'+$container.attr('id')+'-previous_button').click(function(e){ e.preventDefault(); prevFrame(); stopTimer(); });
			$('#'+$container.attr('id')+'-next_button').click(function(e){ e.preventDefault(); nextFrame(); stopTimer(); });
			
			// ----------------------------------------------------------------|| Actions ||			
			// Initializes actions
			checkButtons();
			
			if(settings.auto == true) {
				startTimer(settings.interval);
				checkHover();
			}


			// Moves to frame
			function move(toFrame) {
				if(toFrame !== undefined) {
					if(settings.direction == 'horizontal') {
						$container.animate({
							marginLeft: (-1)*(toFrame - 1)*scrollWidth+'px' // MJ
						}, settings.speed);
					} else if(settings.direction == 'vertical') {
						$container.animate({
							marginTop: (-1)*(toFrame - 1)*wrapperHeight+'px'
						}, settings.speed);
					}
				} else {
					if(settings.direction == 'horizontal') {
						$container.animate({
							marginLeft: (-1)*($.frameNumber - 1)*scrollWidth+'px' // MJ
						}, settings.speed);
					} else if(settings.direction == 'vertical') {
						$container.animate({
							marginTop: (-1)*($.frameNumber - 1)*wrapperHeight+'px'
						}, settings.speed);						
					}
				}
			}
			
			// Moves to previous frame
			function prevFrame() {
				$.frameNumber--;
				if($.frameNumber > 0) {
					move();
				} else {
					move(frameCount);
					$.frameNumber = frameCount;
				}
				checkButtons();
			}
			
			// Moves to next frame
			function nextFrame() {
				loadNext();
				move();
				checkButtons();
			}

			function loadNext ()
			{
				$.frameNumber++;
				if ($.frameNumber > $.maxframeNumber)
				{
					$.maxframeNumber = $.frameNumber;
					$("#flupdate").val("1");
					$("#flposition").val($.frameNumber);
					$('#flickrForm').submit(); 
					$("#flupdate").val("0");
				}

			}
			
			function checkButtons() {
				// Sets 'previous' button to disabled if on first frame
				if($.frameNumber == 1) {
					$('#'+$container.attr('id')+'-previous_button').attr('disabled', 'disabled').addClass('disabled');
				} else {
					$('#'+$container.attr('id')+'-previous_button').removeAttr('disabled').removeClass('disabled');
				}
			}

			function startTimer(interval) {
				auto = setInterval(nextFrame, interval);
			}
			
			function stopTimer() {
				if(settings.auto !== false){
					clearInterval(auto);
				}
			}
			
			function checkHover() {
				$wrapper.hover(function() {
					stopTimer();
				}, function() {
					startTimer(settings.interval);
				});
			}
			
		});
		
		// Allows chainability
		return this;
	}
})(jQuery);

(function($){ 
    $.fn.resetSlider = function(){
	$('#'+$container.attr('id')+'-previous_button').attr('disabled', 'disabled').addClass('disabled');
	$container.html(''); 
    	$container.css({ marginLeft: '0px' });
	$.frameNumber = 1;
	$.maxframeNumber = 1;
	$("#flposition").val($.frameNumber);
    }
})(jQuery)
