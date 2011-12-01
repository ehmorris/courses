/* This code is licensed under the Creative Commons Attribution-NonCommercial
 * License seen here http://creativecommons.org/licenses/by-nc/3.0/legalcode
 * Summary here http://creativecommons.org/licenses/by-nc/3.0/
 */

/* constants used to optimize the calendar's display for any size screen
 */
var START_HOUR = 7;
var END_HOUR = 10; // 1 higher than the last displayed time marker
var NUM_HOURS = (END_HOUR + 12) - START_HOUR;

/* divide window height by number of hours indicated; gets height of each hour 
 * space
 */
var MULTIPLIER = Math.floor(window.innerHeight / NUM_HOURS);

/* constant used to keep track of active credits
 */
var CREDITS = 0;

/* selection of colors randomly chosen for highlighting selected courses
 */
 
// color opacity
var co = '.7';

var COLORS =  ['rgba(172,114,94,'+co+')', 'rgba(208,107,100,'+co+')',
               'rgba(248,58,34,'+co+')', 'rgba(250,87,60,'+co+')', 
               'rgba(255,117,55,'+co+')', 'rgba(255,173,70,'+co+')', 
               'rgba(66,214,146,'+co+')', 'rgba(22,167,101,'+co+')', 
               'rgba(123,209,72,'+co+')', 'rgba(179,220,108,'+co+')', 
               'rgba(251,233,131,'+co+')', 'rgba(250,209,101,'+co+')', 
               'rgba(146,225,192,'+co+')', 'rgba(159,225,231,'+co+')', 
               'rgba(159,198,231,'+co+')', 'rgba(73,134,231,'+co+')', 
               'rgba(154,156,255,'+co+')', 'rgba(185,154,255,'+co+')', 
               'rgba(194,194,194,'+co+')', 'rgba(202,189,191,'+co+')', 
               'rgba(204,166,172,'+co+')', 'rgba(246,145,178,'+co+')', 
               'rgba(205,116,230,'+co+')', 'rgba(164,122,226,'+co+')'];
                
var COLORSh = ['#ac725e', '#d06b64', '#f83a22', '#fa573c', '#ff7537', 
               '#ffad46', '#42d692', '#16a765', '#7bd148', '#b3dc6c', 
               '#fbe983', '#fad165', '#92e1c0', '#9fe1e7', '#9fc6e7', 
               '#4986e7', '#9a9cff', '#b99aff', '#c2c2c2', '#cabdbf', 
               '#cca6ac', '#f691b2', '#cd74e6', '#a47ae2'];

/* updates the constant CREDIT and updates the visible profile with 
 * the new credit count
 */
function update_credits(positivep, increment) {
	if (positivep) {
		CREDITS += parseInt(increment);
	} else {
		CREDITS -= parseInt(increment);
	}
	
	var credit_limit = parseInt($('#student_credit_limit').dataset('credit-limit'));
	
	$('#student_credit_limit').text(CREDITS+'/'+credit_limit);
	
	if (CREDITS >= credit_limit) {
		$('#student_credit_limit').css('color', 'red');
	} else {
		$('#student_credit_limit').removeAttr('style');
	}
}

/* checks if the text of a calendar item fits within the visible area;
 * if not, it recursively sizes it down until it does; expects id to be
 * the id of a .cal_class dom object
 */
function size_text(id) {
	// get the height correct first, don't worry about the width
    if ($(id).children('.summary').children('p')[0].scrollHeight >= $(id).height()) {
        $(id).children('.summary').children('p').css('font-size', '-=1%');
        size_text(id);
    }
}

/* places, colors, etc. a given calendar event; parameter animate is an 
 * optional boolean, defaults to false
 */
function render_cal_class(id, color, animate) {

    id = '#cal_class_'+id;

    var start = MULTIPLIER * ($(id).dataset('start') - START_HOUR);
    var duration = MULTIPLIER * $(id).dataset('duration');
    
    $(id).css({
        'height': duration+'px',
        'top': start+'px',
        'background': color,
    });
    
    // reset resized title text from size_text() on each render
    $(id).children('p').removeAttr('style');
    
    // popping animation - shrink down and then pop out
    if (animate) {
        $(id).css({
            'width': '-=40%',
            'height': '-=40px',
            'margin-top': '20px',
            'margin-left': '20%',
            'font-size': '80%',
            'opacity': 0
        });
        $(id).animate({
            'opacity': 1,
            'margin-top': '0',
            'margin-left': '5%',
            'height': '+=40px',
            'font-size': '100%',
            'width': '90%'
        }, 40, function() {
            // make sure text fits inside cell
            size_text(id);
        });
    } else {
    	size_text(id);
    }
}

/* displays a warning near the overlapping area of a collision; helper function
 * to detect_collisions()
 */
function display_collision(parent_id, id) {

    var parent = '#'+parent_id;
    var other = '#'+id;
    
    $(parent).addClass('collision');
    $(other).addClass('collision');
    
    // set variable for the warning
    var top = 0;
    
    // get start of collision area
    if ($(parent).dataset('start') < $(other).dataset('start')) {
        top = MULTIPLIER * ($(other).dataset('start') - START_HOUR);
    } else {
        top = MULTIPLIER * ($(parent).dataset('start') - START_HOUR);
    }
    
    // append warning onto the column and place it
    $(parent).parent().append(
        '<div style="top:'+top+'px;" class="collision_warning">!</div>'
    );
}

/* detects overlapping courses and triggers display_collision for them
 */
function detect_collisions() {

    // reset everything before going through each item
    $('.cal_class').removeClass('collision');
    $('.collision_warning').remove();
    
    $('.cal_class').not('.collision').each(function() {
    
        // make sure this isn't the only course in its column
        if ($(this).siblings('.cal_class').length > 0) {
        
            var parent_id = $(this).attr('id');
            var parent_start = $(this).dataset('start');
            var parent_duration = $(this).dataset('duration');
            var parent_end = eval(parent_start)+eval(parent_duration);
            
            // test for collision against all other cal items in the column
            $(this).siblings('.cal_class').not('.collision').each(function() {
                   
                var id = $(this).attr('id');
                var start = $(this).dataset('start');
                var duration = $(this).dataset('duration');
                var end = eval(start)+eval(duration);
                                
                if (eval(parent_start) < eval(start)) {
                    if (eval(start) < eval(parent_end)) {
                        display_collision(parent_id, id);
                    }
                } else {
                    if (eval(parent_start) < eval(end)) {
                        display_collision(parent_id, id);
                    }
                }
            });
        }
    });
}

/* from http://bit.ly/uDr6gs; converts rgb value "rgb(255,255,255)" to hex 
 * value "#ffffff"
 */
function rgb2hex(rgb) {
    if (rgb.search("rgb") == -1) {
          return rgb;
    } else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
    }
}

// on page load
$(function() {

    /* update indicators, cal height, constants, cal events, etc. everytime the 
     * window is resized
     */
    $(window).resize(function() {
  		// only evaluate everything every 5 pixels
    	if (!(eval(parseInt(window.innerHeight) % 5))) {
    
	        MULTIPLIER = Math.floor(window.innerHeight / NUM_HOURS);
	        
	        $('.day').height(window.innerHeight);
	        
	        $('#time_indicators div').each(function(i) {
	            $(this).css('top', MULTIPLIER*i+'px');
	        });
	        
	        /* to fix the .cal_class height when an expanded detail pane is 
	         * reverted
	         */
	        $('.cal_class.active').removeClass('active').css({
	            'padding-bottom': '0',
	            'z-index': 10
	        });
	        
	        $('.cal_class').each(function() {
	            var id = $(this).attr('id').substring(10);
	            var color = $(this).css('background-color');
	            
	            render_cal_class(id, color);
	        });
	        
	        detect_collisions();
        
        }
    });

    /* set calendar height
     */
    $('.day').height(window.innerHeight);
    
    /* space out time indicators
     */
    $('#time_indicators div').each(function(i) {
        $(this).css('top', MULTIPLIER*i+'px');
    });
    
    /* prepend the current selected credits (0) to the credit counter
     */
    $('#student_credit_limit').prepend(CREDITS+'/');
    
    /* toggle slide the "classes I need to take" pane on click
     */
    $('#bottom_pane .preview_text').click(function() {
    	if (!($('#bottom_pane').hasClass('visible'))) {
	    	// set calculated top value so that animation scrolling up is possible
	    	$('#bottom_pane').css('top', window.innerHeight - $('#bottom_pane').height());
	        $('#bottom_pane').animate({
	            'top': '4.9em'
	        }, 80);
	    	$('#bottom_pane .class').show();
	    	$('#bottom_pane').addClass('visible');
    	} else {
    		$('#bottom_pane').css('top', 'auto');
	    	// set calculated bottom value so that animation scrolling down is possible
	    	$('#bottom_pane').css('bottom', window.innerHeight - $('#bottom_pane').height());
	        $('#bottom_pane').animate({
	            'bottom': 0
	        }, 80);
    		$('#bottom_pane .class').hide();
    		$('#bottom_pane').removeClass('visible');
    	}
    });
    
    /* everything that happens when you click to reveal a class on the calendar
     */
    $('.class').click(function() {
    
        var details = $(this).children('.details');
        var when = $(details).children('.when');
        
        // get all of this course's basic info
        var crn = $(this).attr('id');
        var days = $(when).dataset('days');
        var start = $(when).dataset('start');
        var duration = $(when).dataset('duration');
        var title = $(this).children('.title').text();
        
        // details vars
        var course_number = $(details).children('.course_number').text();
        var instructor = $(this).children('.professor').text();
        var credits = $(this).children('.credits').text();
        var seats = $(this).children('.capacity').text();
        var location = $(details).children('.location').text();
        var date = $(details).children('.date').text();
        var attribute = $(details).children('.attribute').text();
        
        /* check to make sure no recusions are visible (would indicate that 
         * course is already active) - if none are visible, activate course; 
         * otherwise, deactivate course
         */
        if (!($('#cal_class_'+crn+'_0').length)) {
        
            // get random color to color the course and its calendar events
            var rand_color_array_key = Math.floor(Math.random()*COLORS.length);
            var color = COLORS[rand_color_array_key];
            
            // remove selected color from array to prevent duplicate colors
            COLORS.splice([rand_color_array_key], 1);
                    
            // activate and add color block to clicked course
            $(this).addClass('active');
            // if it's a repeat class with a hidden title
            if ($(this).hasClass('repeat')) {
	            $(this).children('.professor').prepend(
	                '<span style="background:'+color+';" class="color_block">'+
	                    '&nbsp;'+
	                '</span>'
	            );
            } else {
	            $(this).children('.title').prepend(
	                '<span style="background:'+color+';" class="color_block">'+
	                    '&nbsp;'+
	                '</span>'
	            );
            }
            
            // split days string into an array which we can loop through
            var days_array = days.split(', ');
            
            // loop through each day and place all iterations of a course
            $(days_array).each(function(e) {
            
                /* need to give each calendar item / each recursion of an item 
                 * a unique id for it to be placed correctly
                 */
                $('#'+this).append(
                    '<div id="cal_class_'+crn+'_'+e+'"'+
                         'class="cal_class"'+
                         'data-start="'+start+'"'+
                         'data-duration="'+duration+'">'+
                    '<div class="summary"><p>'+title+'</p></div>'+
                        '<div class="details">'+
                        '<span class="crn">'+crn+'</span>'+
                        '<span class="course_number">'+course_number+'</span>'+
                        '<span class="professor">'+instructor+'</span>'+
                        '<span class="credits">'+credits+'</span>'+
                        '<span class="capacity">'+seats+'</span>'+
                        '<span class="location">'+location+'</span>'+
                        '<span class="date">'+date+'</span>'+
                        '<span class="attribute">'+attribute+'</span>'+
                        '</div>'+
                    '</div>'
                );
                                
                // place, color, animate, etc. the added course
                render_cal_class(crn+'_'+e, color, true);
            });
            
            // add to credits counter
            update_credits(1, $(this).children('.credits').dataset('credits'));
            
            // run anytime a course has been activated
            detect_collisions();
        } 
        
        /* events exists: remove event and deactivate course
         */
        else {
        
            /* don't know how many days this event recurs, so just try to 
             * remove up to 5 recursions
             */
            for (var i = 0; i < 5; i++) {
            
                $('#cal_class_'+crn+'_'+i).animate({
                    'opacity': 0,
                    'top': '-=15px'
                }, 60, function() {
                
                    $(this).remove();
                    
                    /* run anytime a course has been deactivated, to remove any 
                     * warnings for solved collisions; have to run after 
                     * animation is complete
                     */
                    detect_collisions();
                });
            }
            
            var replace_color = $(this).find('.color_block')
                                       .css('background-color');
            // replace_color = rgb2hex(replace_color);
            
            // replace the disabled color into the color array
            COLORS.push(replace_color);
            
            // subtract from credits counter
            update_credits(0, $(this).children('.credits').dataset('credits'));
            
            $(this).removeClass('active');
            $(this).find('.color_block').remove();
        }
    });
    
    /* reveal detailed info on click of a calendar item
     */
    $('.cal_class').live('click', function() {
        
        $(this).toggleClass('active');
        var details_height = $(this).children('.details').height();
        
        /* increase height to accomodate details on activate
         */
        if ($(this).hasClass('active')) {
            $(this).css('z-index', 90);
            $(this).animate({
                'height': details_height+'px',
                'padding-bottom': '1em'
            }, 30);
        }
        
        /* re-render the step on deactivate
         */
        else {
            $(this).css({
                'padding-bottom': '0',
                'z-index': 10
            });
            
            var id = $(this).attr('id').substring(10);
            var color = $(this).css('background-color');
            
            render_cal_class(id, color, true);
        }
    });
});