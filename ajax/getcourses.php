<?php

require '../config.php';

if (isset($_POST['subject'])) :

// todo: sanitize this
$subject = $_POST['subject'];

// get all classes from a subject
$all_class_data = $connection->query("SELECT * FROM classes WHERE subject = '$subject' AND time != 'TBA'");

// takes day string formatted like "MWR" and converts it to a
// full string like "Monday, Wednesday, Thursday"
function convert_day_string($day_string) {

  $days_array = str_split($day_string);
  foreach ($days_array as $key => $day) {
    if (strtolower($day) == 'm')
      $days_array[$key] = 'Monday';
    if (strtolower($day) == 't')
      $days_array[$key] = 'Tuesday';
    if (strtolower($day) == 'w')
      $days_array[$key] = 'Wednesday';
    if (strtolower($day) == 'r')
      $days_array[$key] = 'Thursday';
    if (strtolower($day) == 'f')
      $days_array[$key] = 'Friday';
  }

  return implode(', ', $days_array);
}

// takes a time string like "3:30pm" and converts it to a unix
// timestamp
// this funciton returns a 12 hour based time value like 3:30pm,
// and a decimal, 24 hour based time value like 15.5
function convert_time($time) {

  $twelve_hour = date('g:ia', strtotime($time));

  $hour = date('G', strtotime($time));

  // 05 will calculate the same as 50 unless we check if the 
  // value is less than 10
  if (date('i', strtotime($time)) < 10)
    $minute_decimal = '0'.floor(1.66667 * date('i', strtotime($time)));
  else
    $minute_decimal = floor(1.66667 * date('i', strtotime($time)));

  $decimal = $hour.'.'.$minute_decimal;

  return array('twelve' => $twelve_hour, 'decimal' => $decimal);
}

while ($class_data = $all_class_data->fetch()) {

  $days = convert_day_string($class_data['days']);

  // split string like "1:30pm-3:00pm" into beginning and end times
  $times = explode('-', $class_data['time']);

  $start_time = convert_time($times[0]);
  $end_time = convert_time($times[1]);
  $duration = $end_time['decimal'] - $start_time['decimal'];

  $seats_taken = $class_data['capacity'] - $class_data['remaining'];

  $seats_warning = '';
  if ($seats_taken >= ($class_data['capacity']))
    $seats_warning = 'warning';

  $course_repeat = '';
  if ($class_data['course_number'] == $prev_course_number)
    $course_repeat = 'repeat';

  echo '<div id="'.$class_data['crn'].'" class="class '.$course_repeat.'">';
    echo '<span class="title">'.$class_data['title'].'</span>';
    echo '<span class="subject">'.$class_data['subject'].'</span>';
    echo '<span class="credits" data-credits="'.$class_data['credits'].'">'.$class_data['credits'].'</span>';
    echo '<span class="capacity '.$seats_warning.'">'.$seats_taken.'/'.$class_data['capacity'].'</span>';
    echo '<span class="professor">'.$class_data['instructor'].'</span>';
    echo '<div class="details">';
      echo '<span class="when" data-days="'.$days.'" data-start="'.$start_time['decimal'].'" data-end="'.$end_time['decimal'].'" data-duration="'.$duration.'">';
        echo $days.' - '.$start_time['twelve'].' to '.$end_time['twelve'];
      echo '</span>';
      echo '<span class="location">'.$class_data['location'].'</span>';
      echo '<span class="date">'.$class_data['date'].'</span>';
      echo '<span class="crn">'.$class_data['crn'].'</span>';
      echo '<span class="course_number">'.$class_data['course_number'].'</span>';
      echo '<span class="attribute">'.$class_data['attribute'].'</span>';
    echo '</div>';
  echo '</div>';

  // store for next loop to determine if its an alternative time
  $prev_course_number = $class_data['course_number'];
}

endif;
