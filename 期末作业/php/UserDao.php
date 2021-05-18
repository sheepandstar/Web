<?php
 
namespace net\hw\dao;
 
require_once("User.php");
require_once("DataSource.php");
 
use \net\hw\bean\User;
use \net\hw\util\DataSource;
 
class UserDao//用户数据访问类
{
    public function findUser($username)//依据用户名查找用户
    {
        $dataSource = new DataSource();
        $conn = $dataSource->getConn();
        $sql = "select * from User where username = '$username'";
        $result = $conn->query($sql);
        $row = $result->fetch_array(MYSQLI_ASSOC);
        $user = new User();
        $user->setUsername($row['username']);
        $user->setPassword($row['password']);
        $user->setGrade($row['grade']);
        return $user;
    }
 
    public function findAllUsers()//查找所有用户
    {
        $dataSource = new DataSource();
        $conn = $dataSource->getConn();
        $sql = "select * from User";
        $result = $conn->query($sql);
        $i = 0;
        $users = array();
        while($row = $result->fetch_assoc()) {
            $users[$i] = new User();
            $users[$i]->setUsername($row['username']);
            $users[$i]->setPassword($row['password']);
            $users[$i]->setGrade($row['grade']);
            $i++;
        }
 
        return $users;
    }
 
    public function login($username, $password)//登陆
    {
        $dataSource = new DataSource();
        $conn = $dataSource->getConn();
        $sql = "select * from User where username = '$username' and password = '$password'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function check_username($username)//检查用户名是否存在
    {
        $dataSource = new DataSource();
        $conn = $dataSource->getConn();
        $sql = "select * from User where username = '$username'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function ChangeGrade($username,$score)//更改成绩（最高分）
    {
        
        $dataSource = new DataSource();
        $conn = $dataSource->getConn();
        $sql = "select grade from User where username = '$username'";
        $result = $conn->query($sql);
        $row = $result->fetch_array(MYSQLI_ASSOC);
        $oldgrade = $row['grade'];
        if($score > $oldgrade)
        {
            $sql1 = "update User set grade = '$score' where username = '$username'";
            $result1 = $conn->query($sql1);
        }
    }

    public function getGrade($username)//获取历史最高分
    {
        
        $dataSource = new DataSource();
        $conn = $dataSource->getConn();
        $sql = "select grade from User where username = '$username'";
        $result = $conn->query($sql);
        $row = $result->fetch_array(MYSQLI_ASSOC);
        $grade = $row['grade'];
        return $grade;
    }

    public function register($username,$password)//注册
    {
        $score = 0;
        $dataSource = new DataSource();
        $conn = $dataSource->getConn();
        $sql = "insert into User (username,password,grade) values ('$username','$password','$score')";
        $result = $conn->query($sql);
        return true;
    }
}
 
?>