// constants used to optimize the calendar's display for any size screen
var START_HOUR = 7;
var END_HOUR = 10; // 1 higher than the last displayed time marker
var NUM_HOURS = (END_HOUR + 12) - START_HOUR;

// divide window height by number of hours indicated
// gets height of each hour space
var MULTIPLIER = Math.floor(window.innerHeight / NUM_HOURS);

// selection of colors randomly chosen for highlighting selected courses
var COLORS = ['#ac725e', '#d06b64', '#f83a22', '#fa573c', '#ff7537', '#ffad46', '#42d692',
			  '#16a765', '#7bd148', '#b3dc6c', '#fbe983', '#fad165', '#92e1c0', '#9fe1e7',
			  '#9fc6e7', '#4986e7', '#9a9cff', '#b99aff', '#c2c2c2', '#cabdbf', '#cca6ac',
			  '#f691b2', '#cd74e6', '#a47ae2'];

// places and colors a given calendar event
function render_cal_class(id, color) {
	// place the calendar event
	var start = MULTIPLIER * ($('#cal_class_'+id).dataset('start') - START_HOUR);
	var duration = MULTIPLIER * $('#cal_class_'+id).dataset('duration');
	$('#cal_class_'+id).height(duration+'px');
	$('#cal_class_'+id).css('top', start+'px');
	// color the calendar event
	$('#cal_class_'+id).css('background', color);
	$('#cal_class_'+id).hide().fadeIn(60);
}

// displays a warning near the overlapping area of a collision
function display_collision(parent_id, id) {
	var parent = '#'+parent_id;
	var other = '#'+id;
	$(parent).addClass('collision');
	$(other).addClass('collision');
	
	// set variable for the warning
	var top = 0;
	
	// get start and duration of collision area
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

// detects and logs overlapping courses
function detect_collisions() {
	// reset everything before going through each item
	$('.cal_class').removeClass('collision');
	$('.collision_warning').remove();
	
	$('.cal_class').not('.collision').each(function() {
		// make sure this isn't the only course of the day column
		if ($(this).parent().children('.cal_class').length > 1) {
			var parent_id = $(this).attr('id');
			var parent_start = $(this).dataset('start');
			var parent_duration = $(this).dataset('duration');
			var parent_end = eval(parent_start)+eval(parent_duration);
			// test for collision against every other calendar item in the column
			$(this).parent().children('.cal_class').not('#'+parent_id).not('.collision').each(function() {
				var id = $(this).attr('id');
				var start = $(this).dataset('start');
				var duration = $(this).dataset('duration');
				var end = eval(start)+eval(duration);
				// collision test
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

// from http://stackoverflow.com/questions/1740700/get-hex-value-rather-than-rgb-value-using-jquery
// converts rgb value "rgb(255,255,255)" to hex value "#ffffff"
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

	// set calendar height
	$('.day').height(window.innerHeight);
	
	// space out time indicators
	$('#time_indicators div').each(function(i) {
		$(this).css('top', MULTIPLIER*i+'px');
	});
	
	$('.class').click(function() {
		
		// get all of this course's info
		var crn = $(this).attr('id');
		var when = $(this).children('.details').children('.when');
		var days = $(when).dataset('days');
		var start = $(when).dataset('start');
		var duration = $(when).dataset('duration');
		var title = $(this).children('.title').text();
		
		// check to make sure no recusions are visible (would indicate that course is already
		// active) - if none are visible, activate course; otherwise, deactivate course
		if (!($('#cal_class_'+crn+'_0').length)) {
			// get random color to color the course and its calendar events
			var rand_color_array_key = Math.floor(Math.random()*COLORS.length);
			var color = COLORS[rand_color_array_key];
			// remove selected color from random array to prevent duplicate colors
			COLORS.splice([rand_color_array_key], 1);
					
			// activate and add color block to clicked course
			$(this).addClass('active');
			$(this).children('.title').prepend('<span style="background:'+color+';" class="color_block">&nbsp;</span>');
		
			var days_array = days.split(', ');
			
			$(days_array).each(function(e) {
				// need to give each calendar item / each recursion of an item a 
				// unique id for it to be placed correctly
				$('#'+this).append(
					'<div id="cal_class_'+crn+'_'+e+'" class="cal_class" data-start="'+start+'" data-duration="'+duration+'">'+
						'<p>'+title+'</p>'+
					'</div>'
				);
				
				render_cal_class(crn+'_'+e, color); // places and colors the calendar event
			});
			
			// run anytime a course has been activated
			detect_collisions();
		} 
		// remove event and deactivate course
		else {
			// don't know how many days this event recurs, so just try to remove up to 5 recursions
			for (var i = 0; i < 5; i++) {
				//$('#cal_class_'+crn+'_'+i).remove();
				$('#cal_class_'+crn+'_'+i).animate({
					'opacity': 0,
					'top': '-=10'
				}, 60, function() {
					$(this).remove();
					// run anytime a course has been deactivated, to remove any 
					// warnings for solved collisions
					// have to run after animation is complete
					detect_collisions();
				});
			}
			var replace_color = rgb2hex($(this).children('.title').children('.color_block').css('background-color'));
			COLORS.push(replace_color); // re-put the disabled color into the color array
			
			$(this).removeClass('active');
			$(this).children('.title').children('.color_block').remove();
		}
	});
	
	// use change event and checked selectors - click event and toggle were
	// returning strange results - need to be more verbose
	// trigger hides all non active classes, and temporarily removes the repeat
	// class so that no classes are indented in the selected list
	$('#show_selected').click(function() {
		
		// toggle checkbox state when the paragraph container is clicked
		$(this).children('input').attr('checked', !$(this).children('input').attr('checked'));
		
		if ($(this).children('input').is(':checked')) {
			$('.class:not(.active)').hide();
			
			$('.class.active.repeat').addClass('repeat_hide');
			$('.class.active.repeat').removeClass('repeat');
		} else {
			$('.class:not(.active)').show();
			$('.class.active.repeat_hide').addClass('repeat');
			$('.class.active.repeat_hide').removeClass('repeat_hide');
		}
	});
});