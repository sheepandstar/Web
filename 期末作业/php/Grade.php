<?php
require_once("UserDao.php");
use \net\hw\dao\UserDao;
 
$username=$_GET["username"];
$userDao = new UserDao();
$score=$_GET["score"];

$userDao->ChangeGrade($username,$score);
$user = $userDao->findUser($username);
echo $user . "<br>";
?>