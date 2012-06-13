/* load jQuery onto the page
 *****************************************************************************/

var script = document.createElement('script');
    script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js';
    script.type = 'text/javascript';

    document.getElementsByTagName('head')[0].appendChild(script);

/* login to myneu
 *****************************************************************************/



/* select term
 *****************************************************************************/



/* select subject
 *****************************************************************************/



/* scrape all classes within a subject
 *****************************************************************************/

// get table w/ course info
var datatable = $('table.datadisplaytable tbody');

// init var into which course JSON will be placed
var coursedata = { 'courses' : [] };

// go through each row and extract data
$(datatable).children('tr').each(function(e) {

  /* assumed order of information in table row
   * (non-item) Select Box
   * CRN
   * Subject
   * Course Number
   * Section
   * Campus
   * Credits
   * Title
   * Days
   * Time
   * Capacity
   * Actual Capacity
   * Remaining Seats
   * Instructor
   * Date
   * Location
   * Attribute
   */

  var children = $(this).children();

  // only collect row info if row items are not headers
  if (children.eq(1).hasClass('dddefault')) {

    var crn       = children.eq(1).text();
    var subject   = children.eq(2).text();
    var courseNum = children.eq(3).text();
    var section   = children.eq(4).text();
    var campus    = children.eq(5).text();
    var credits   = children.eq(6).text();
    var title     = children.eq(7).text();
    var days      = children.eq(8).text();
    var time      = children.eq(9).text();
    var capacity  = children.eq(10).text();
    var actual    = children.eq(11).text();
    var remaining = children.eq(12).text();
    var professor = children.eq(13).text();
    var date      = children.eq(14).text();
    var location  = children.eq(15).text();
    var attribute = children.eq(16).text();

    coursedata.courses.push({
      'crn'       : crn,
      'subject'   : subject,
      'courseNum' : courseNum,
      'section'   : section,
      'campus'    : campus,
      'credits'   : credits,
      'title'     : title,
      'days'      : days,
      'time'      : time,
      'capacity'  : capacity,
      'actual'    : actual,
      'remaining' : remaining,
      'professor' : professor,
      'date'      : date,
      'location'  : location,
      'attribute' : attribute
    });

  }

});

// output subject info
console.log(coursedata);

/* convert json object to sql
 *****************************************************************************/

var sql = '';

$.each(test.courses, function(e, v) {
  sql += 'INSERT INTO `classes` VALUES (';
  sql += '"'+v.crn+'",';
  sql += '"'+v.subject+'",';
  sql += '"'+v.courseNum+'",';
  sql += '"'+v.section+'",';
  sql += '"'+v.credits+'",';
  sql += '"'+v.title+'",';
  sql += '"'+v.days+'",';
  sql += '"'+v.time+'",';
  sql += '"'+v.capacity+'",';
  sql += '"'+v.actual+'",';
  sql += '"'+v.remaining+'",';
  sql += '"'+v.professor+'",';
  sql += '"'+v.date+'",';
  sql += '"'+v.location+'",';
  sql += '"'+v.attribute+'"';
  sql += ');';
});
