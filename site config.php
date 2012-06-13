<?php

/* class list
 *  - improve show selected filter
 *  - add finalize button
 *  - hide full classes
 *  - add filters for each parameter
 *  - add search
 *  ~ format detail data
 *
 * calendar
 *  - create hover effect that reveals more info
 *  - add close button
 *  - show ticker of credits selected out of credits limit
 *  - add a finalize button that returns a list of CRNs
 *  - add a "share my calendar" option
 *  - disabled finalize button if there are any errors (credit limit or overlap)
 *
 * after
 *  - get more data
 *  - show to /r/NEU and facebook
 *
 * future
 *  - indicate dependencies such as prerequisites / corequisites
 *  - add a compare feature to compare your calendar with another
 *  - add a find this professor on ratemyprofessor.com
 *  - integrate w/ facebook / current school's classes database
 *  - integrate w/ degree audit to show classes they need to take
 *  - option to only display classes that are possible for user to take
 */

$title = 'Class Search';

$hostname = 'localhost';
$username = 'ehmorris_classes';
$password = 'L1s82XJaM4';
$database = 'ehmorris_classes';

try {
	$connection = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);
}
catch (PDOException $e) {
  echo $e->getMessage();
  exit;
}

date_default_timezone_set('America/New_York');

?>
