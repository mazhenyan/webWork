//处理登入请求
$(function () {
    $btn = $("#submit");
    var savedID = localStorage.getItem("userID");
    var savedPassword = localStorage.getItem("password");
    if(savedID != "" && savedPassword != ""){
        $("#userID").val(savedID);
        $("#password").val(savedPassword);
    }
    $btn.on('click',function () {
        $userID = $("#userID").val();
        $password = $("#password").val();
        if($userID == ""){
            alert("请输入账号！");
            return ;
        } else if($password == ""){
            alert("请输入密码！");
            return ;
        }
        $.ajax({
            type:"post",
            url:"/login",
            data:{userID:$userID,password:$password},
            dataType:"json",
            success:function (data) {
                console.log(data);
                if(data.ret == 0){
                    alert("账号不存在！");
                }else if(data.ret == 2){
                    alert("密码错误！");
                }else if(data.ret == 1){
                    //进行页面的转跳
                    localStorage.setItem("userID",$userID);
                    localStorage.setItem("password",$password);
                    location.href = "/main";
                }else {
                    alert("服务器端异常！");
                }
            },
            error:function () {
                alert("error");
            }
        })
    });
});