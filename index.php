<?php require 'config.php'; ?>

<!doctype html>
<html dir="ltr" lang="en-US">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title><?= $title ?></title>
		<link href="normalize.css" rel="stylesheet" type="text/css" media="screen" />
		<link href="screen.css" rel="stylesheet" type="text/css" media="screen" />
		<script type="text/javascript" src="jquery-1.6.4.min.js"></script>
		<script type="text/javascript" src="dataset.js"></script>
		<script type="text/javascript" src="flip.js"></script>
		<script type="text/javascript" src="app.js"></script>
	</head>
	<body>
		<section id="classes">
			<div id="options">
				<p id="hide_unselected"><input type="checkbox" /> <label>hide all unselected</label></p>
				<p id="hide_full"><input type="checkbox" /> <label>hide all full</label></p>
			</div>
			<?php
			
				$all_class_data = $connection->query("SELECT * FROM classes");
				
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
						echo '<span class="credits">'.$class_data['credits'].'</span>';
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
			
			?>
		</section>
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