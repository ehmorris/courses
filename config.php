<?php

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