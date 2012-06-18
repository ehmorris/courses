<?php require 'config.php'; ?>

<!doctype html>
<html dir="ltr" lang="en-US">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= $title ?></title>
    <link type="text/css" href="css/normalize.css" rel="stylesheet" media="screen" />
    <link type="text/css" href="css/screen.css" rel="stylesheet" media="screen" />
    <script type="text/javascript" src="js/jquery-1.6.4.min.js"></script>
    <script type="text/javascript" src="js/dataset.js"></script>
    <script type="text/javascript" src="js/quicksilver.js"></script>
    <script type="text/javascript" src="js/jquery.livesearch.js"></script>
    <script type="text/javascript" src="js/app.js"></script>
    <script type="text/javascript">
      $(function() {
        $('#filter_major').change(function() {
          $.ajax({
            type: 'POST',
            url: 'ajax/getcourses.php',
            data: { 'subject' : $(this).val() },
            success: function(data) {
              // scroll to top of new list
              window.scrollTo(0,0);
              // insert data
              $('#classes .class-list').html(data);
              // initiate filtering 
              $('#search').liveUpdate('.class', '.title').focus();
              // toggle search targets
              $('.search_toggle a').click(function() {
                $('.search_toggle a').removeClass('active');
                $(this).addClass('active');
                $('#search').liveUpdate('.class', $(this).data('target')).focus();
              });
            }
          });
        });
      });
    </script>
  </head>
  <body>
    <section id="classes">
      <div id="top_pane" class="pane">
        <div id="filters">
          <form>
            <select id="filter_major">
              <option>Select subject...</option>
              <?php

                $all_subjects_data = $connection->query("SELECT * FROM subjects ORDER BY subject_fulltext");

                while ($subjects_data = $all_subjects_data->fetch()) {

                  echo '<option value="'. $subjects_data['subject_acronym'] .'">' . $subjects_data['subject_fulltext'] . '</option>';

                }

              ?>
            </select>
            <div class="search_toggle">
              <a href="javascript:;" data-target=".title" class="active">class</a>
              <a href="javascript:;" data-target=".professor">prof</a>
            </div>
            <input class="filter_search" id="search" type="text" placeholder="Search by..." />
            <select id="filter_sort">
              <option>Sort by...</option>
              <option>Name</option>
              <option>CRN</option>
              <option>Course number</option>
            </select>
            <!--)
            <span id="filter_credits">
              <label>Include classes of</label>
              <label><input type="checkbox" checked="checked" /> 1</label>
              <label><input type="checkbox" checked="checked" /> 2</label>
              <label><input type="checkbox" checked="checked" /> 3</label>
              <label><input type="checkbox" checked="checked" /> 4</label>
              credit(s)
            </span>
            -->
          </form>
        </div>
      </div>
      <section class="class-list"><!-- class list --></section>
    </section>
    <a href="javascript:finished();" id="finished">Finished</a>
    <a href="javascript:expand_classes();" id="expand-classes">Expand</a>
    <section id="weekview">
      <div class="day color" id="Monday"></div>
      <div class="day" id="Tuesday"></div>
      <div class="day color" id="Wednesday"></div>
      <div class="day" id="Thursday"></div>
      <div class="day color" id="Friday"></div>
      <div id="time_indicators">
        <div>7am</div>
        <div>8am</div>
        <div>9am</div>
        <div>10am</div>
        <div>11am</div>
        <div>12pm</div>
        <div>1pm</div>
        <div>2pm</div>
        <div>3pm</div>
        <div>4pm</div>
        <div>5pm</div>
        <div>6pm</div>
        <div>7pm</div>
        <div>8pm</div>
        <div>9pm</div>
      </div>
    </section>
  </body>
</html>
