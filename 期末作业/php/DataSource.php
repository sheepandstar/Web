<?php
namespace net\hw\util;
 
class DataSource//数据源类
{
    public function getConn()
    {
        $host = "localhost";
        $username = "root";
        $password = "yx616515";
        $dbname = "game";
 
        $conn = mysqli_connect($host, $username, $password, $dbname);
 
        if ($conn->connect_errno)
        {
            die("连接MySQL数据库失败！" . $conn->connect_error);
        }
        return $conn;
    }
}