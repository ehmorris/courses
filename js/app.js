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

/* checks if the text of a calendar item fits within the visible area;
 * if not, it recursively sizes it down until it does; expects id to be
 * the id of a .cal_class dom object
 */
function size_text(id, width_correct) {
  var title_width = $(id).children('.summary').children('p')[0].scrollWidth;
  var title_height = $(id).children('.summary').children('p')[0].scrollHeight;

  // make sure the width is as large as possible
  if (!width_correct && title_width <= $(id).innerWidth()) {
    $(id).children('.summary').children('p').css('font-size', '+=1%');
    size_text(id, false);
  }
  // make sure it's not too wide (for sizing the browser down)
  else if (!width_correct && title_width >= $(id).innerWidth) {
    $(id).children('.summary').children('p').css('font-size', '-=1%');
    size_text(id, false);
  }
  // make sure the height fits, and tag the width sizing as done
  else if (title_height >= $(id).height()) {
    $(id).children('.summary').children('p').css('font-size', '-=1%');
    size_text(id, true);
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
      size_text(id, false);
    });
  } else {
    size_text(id, false);
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

/* goes through all visible courses and gets their CRNs
 */
function finished() {
  var crns = [];
  $('.cal_class').each(function(e) {
    // makes sure CRN is not a repeat of the previous CRN
    if ($(this).data('crn') !== crns[e-1]) {
      crns.push($(this).data('crn'));
    }
  });
  console.log(crns);
}

// on page load
$(function() {
  // size the class list
  $('#classes').height(window.innerHeight);

  /* update indicators, cal height, constants, cal events, etc. everytime the 
   * window is resized
   */
  $(window).resize(function() {
    // only evaluate everything every 2 pixels
    if (!(eval(parseInt(window.innerHeight) % 2))) {

      MULTIPLIER = Math.floor(window.innerHeight / NUM_HOURS);

      $('#classes').height(window.innerHeight);

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

  /* everything that happens when you click to reveal a class on the calendar
   */
  $('.class').live('click', function() {

    var when = $(this).children('.details').children('.when');

    // get all of this course's basic info
    var crn = $(this).attr('id');
    var days = $(when).dataset('days');
    var start = $(when).dataset('start');
    var duration = $(when).dataset('duration');
    var title = $(this).children('.title').text();

    /* check to make sure no recursions are visible (would indicate that 
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
            'data-crn="'+crn+'"'+
            'data-start="'+start+'"'+
            'data-duration="'+duration+'">'+
          '<div class="summary"><p>'+title+'</p></div>'+
          '</div>'
        );

        // place, color, animate, etc. the added course
        render_cal_class(crn+'_'+e, color, true);
      });

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
          'top': '-=30px'
        }, 80, function() {

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

      $(this).removeClass('active');
      $(this).find('.color_block').remove();
    }
  });

  /* reveal detailed info on click of a calendar item
   */
  $('.cal_class').live('click', function() {

    var crn = $(this).data('crn');

  });
});
