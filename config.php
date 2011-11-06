<?php

/* class list
 *  - add finalize button
 *  - add filters
 *  - add search
 *  ~ format detail data
 *
 * calendar
 *  - create hover effect that reveals more info
 *  - add close button
 *
 * after
 *  - get more data
 *  - show to /r/NEU and facebook
 *  - option to hide full classes
 */

$title = 'Class Search';

$hostname = '127.0.0.1';
$username = 'root';
$password = 'root';
$database = 'classes';

try {
	$connection = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);
}
catch (PDOException $e) {
	echo $e->getMessage();
}


?>