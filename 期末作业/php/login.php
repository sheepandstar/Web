<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>用户登录</title>
    <link rel ="icon" type="image/x-icon" href = "../img/i.ico" >
    <style type="text/css">
    body{
      background-image: url("../img/bg.png");/*背景图*/
    }

    .form{
      overflow:hidden;
      width:50%;
      padding:50px 0px;
      margin:auto;
      background:rgba(255,255,255,0.5);
    }

    .head h1{
      text-align: center;
      margin: 100px;
    }

    .username , .mm{
      width: 390px;
      border-bottom: gray 1px solid ;
      margin: auto;
      background-color: white;
      opacity:0.5;
    }

    .username>input , .mm>input{
      border: none;
      font-size: 20px;
      outline: none;
      background-color: white;
    }

    .mm img{
      position: absolute;
      width: 50px;
      height: 100%;
      opacity: 0.5;
      
    }
    .mm{
      position: relative;
    }
    .mm p{
      display: inline-block;
      margin:0px 0px 0px 50px;
      padding-left: 15px;
      color: gray;
      border-left: 1px solid gray;
    }

    .mm p input{
        background-color:white;
        border:none;
        font-size:1.2em;
        color:gray;
    }

    .submit input{
      display: block;
      margin: auto;
      width: 200px;
      height: 40px;
      border-radius: 25px;
      border:none;
      color: white;
      background-color: rgba(211, 55, 55, 0.651);
      outline: none;
    }

    </style>
</head>
<body>
<div class="head">
   <h1>用户登录</h1>
</div>

<form action="doLogin.php" method="POST">
  <div class="form">
    <div class="username">
        <label for="username">  </label>
        <input type="text" name="username" id="username" placeholder="用户名">
        
    </div>
    <br><br>
    <div class="mm">
         <label for="password">  </label>
         <input type="password" id="password" name="password" placeholder="请输入密码" >
         <img src="../img/eye_close.png" id="eye">
         <p><input type="reset" value="重置" id="reset"></p>
    </div>
    <br><br><br>
    <div class="submit">
        <input type="submit" value="登录 / 注册" onclick="return checkForm();">
    </div>
  </div>
</form>
</body>

<script type="text/javascript">
    var mm_in = document.getElementById('password');//获取密码
    var img = document.getElementById('eye');//获取密码显示图片
    var flag = 0;//标记,c初值表示隐藏密码
    img.onclick=function(){//给图像设置点击事件
      if(flag==0)//隐藏密码
      {
        mm_in.type="text";
        img.src="../img/eye_open.png";
        flag=1;//显示密码
      }
      else{
        mm_in.type="password";
        img.src="../img/eye_close.png";
        flag=0;//隐藏密码
      }
    }

    //检查表单
    function checkForm() {
        var username = document.getElementById("username").value;//获取用户名的值
        var password = document.getElementById("password").value;//获取密码
 
        if (username == null || username == "") {
            alert("用户名不能为空！");
            document.getElementById("username").focus();
            return false;
        }
 
        if (password == null || password == "") {
            alert("密码不能为空！");
            document.getElementById("password").focus();
            return false;
        }
        return true;
    }
</script>
</html>