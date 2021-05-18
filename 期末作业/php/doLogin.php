<?php
//登陆处理页面
require_once("UserDao.php");
use \net\hw\dao\UserDao;
 
$username = $_POST["username"];
$password = $_POST["password"];
 
$userDao = new UserDao();
$success = $userDao->login($username, $password);
$checkname = $userDao->check_username($username);
$maxgrade = $userDao->getGrade($username);
if ($success) {//用户名密码均存在,登陆成功
    echo "<script language = 'javascript'>alert('登陆成功！即将跳转到游戏界面。'); 
	window.location.href = '/t/index.html?username=$username&maxgrade=$maxgrade';		
    </script>";
} else {
    if($checkname)//用户名存在，即输入密码错误
    {
        echo "<script language = 'javascript'>alert('密码输入错误!请重新输入。'); 
		window.location.href = 'login.php?username=$username';		
        </script>";

    }
    else//用户名不存在，即需要注册新用户
    {
        $reg = $userDao->register($username,$password);
        if($reg)//注册成功
        {
            $maxgrade = 0;
            echo "<script language = 'javascript'>alert('注册成功!即将跳转到游戏界面。'); 
            window.location.href = '/t/index.html?username=$username&maxgrade=$maxgrade';		
            </script>";
        }
        else{//注册失败
            echo "<script language = 'javascript'>alert('注册失败!请重新注册。');
            window.location.href = 'login.php?';		
	        </script>";
        }
    }
}
?>