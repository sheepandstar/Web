<?php
 
namespace net\hw\bean;
 
class User//用户实体类
{
    private $username;
    private $password;
    private $grade;

    /**
     * @return mixed
     */
    public function getUsername()
    {
        return $this->username;
    }
 
    /**
     * @param mixed $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
    }
 
    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }
 
    /**
     * @param mixed $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }
 
    /**
     * @return mixed
     */
    public function getGrade()
    {
        return $this->grade;
    }
 
    /**
     * @param mixed $grade
     */
    public function setGrade($grade)
    {
        $this->grade = $grade;
    }
 
   
    function __toString()
    {
        return "User{username='$this->username',
        password='$this->password', grade='$this->grade'}";
    }
}
 
?>