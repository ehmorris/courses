<?php

$title = 'Class Search';

$hostname = getenv('MYSQL_DB_HOST');
$username = getenv('MYSQL_USERNAME');
$password = getenv('MYSQL_PASSWORD');
$database = getenv('MYSQL_DB_NAME');

try {
  $connection = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);
}
catch (PDOException $e) {
  echo $e->getMessage();
  exit;
}

date_default_timezone_set('America/New_York');

?>
