$(function () {
    $("#modifyBookInfo").hide();
    acInfo();
    search();
    increaseBook();
//    设置书籍的入库时间不能超过现在时间
    if((new Date().getMonth()+1).toString().length == 1)
        var month = "0"+(new Date().getMonth()+1).toString();
    var str = new Date().getFullYear()+'-'+month+'-'+new Date().getDate();
    $("#modifyBookTime").attr("max",str);
});
function acInfo() {
    $.ajax({
        type:"get",
        url:"/getInfo",
        dataType:"json",
        success:function (data) {
            //    将书籍信息进行显示
            if(data[0].ret == 1){
                //    进行书籍的显示，字符串的拼接
                for (var i = data.length - 1;i >= 1;i--){
                    var str = `
            <tr>
            <td>${data[i].ID}</td>
            <td>${data[i].name}</td>
            <td>${data[i].time}</td>
            <td>${data[i].price}</td>
            <td><button type="button" class="btn btn-primary" class="modifyBtn" onclick="modifyFun(this)">修改</button></td>
            <td><button type="button" class="btn btn-primary" class="deleteBtn" onclick="deleteFun(this)">删除</button></td>
            </tr>
                    `;
                    var $tableHead = $("#tableHead");
                    $tableHead.after(str);
                }
            }
        },
        error:function () {
            alert("error");
        }
    });
}
//获取信息
function getInfo(e) {
    var allInfo = e.parentNode.parentNode.getElementsByTagName("td");
    var bookInfo = new Object();
    bookInfo.ID = allInfo[0].innerText;
    bookInfo.name = allInfo[1].innerText;
    bookInfo.time = allInfo[2].innerText;
    bookInfo.price = allInfo[3].innerText;
    return bookInfo;
}
//增加书籍操作
function increaseBook() {
    $("#increaseBook").on('click',function () {
        //书籍编号是不可以修改的!!!
        var bookInfo = new Object();
        var IDlength = document.getElementsByTagName("tr");
        var IDfig = IDlength[IDlength.length-1].getElementsByTagName("td")[0].innerText;
        if(IDlength.length-1 == 0){
            $("#modifyBookID").val(1);
        }else{
            $("#modifyBookID").val(parseInt(IDfig)+1);
        }
        $("#modifyBookName").val("");
        $("#modifyBookTime").val("");
        $("#modifyBookPrice").val("");
        $("#modifyBookInfo").show();
        $("#modifyBookConfig").on('click',function () {
            bookInfo.ID = $("#modifyBookID").val();
            bookInfo.name = $("#modifyBookName").val();
            if($("#modifyBookName").val() == ""){
                alert("请输入书籍名称");
                return ;
            }
            bookInfo.time = $("#modifyBookTime").val();
            if($("#modifyBookTime").val() == ""){
                alert("请输入入库时间");
                return ;
            }
            bookInfo.price = $("#modifyBookPrice").val();
            if($("#modifyBookPrice").val() == ""){
                alert("请输入书籍价格");
                return ;
            }
            if(isNaN(bookInfo.price) == true){
                alert("请输入正确的书籍价格!");
                return ;
            }
            $.ajax({
                type: "get",
                url: "/increase",
                dataType: "json",
                data:{ID:bookInfo.ID,name:bookInfo.name,time:bookInfo.time,price:bookInfo.price},
                success:function (data) {
                    if(data.ret == 1){
                        alert("增加成功!");
                        window.location.reload();
                    }
                    console.log(data);
                },
                error:function (e) {
                    alert("error");
                }
            });
            $("#modifyBookInfo").hide();
        });
        $("#modifyBookCancel").on('click',function () {
            $("#modifyBookInfo").hide();
        })
    })
}
//查找书籍信息
function search() {
    var $findBook = $("#findBook");
    $findBook.bind("input propertychange", function() {
        document.onkeyup = function (e) {
            if(e.code == "Enter"){
            //    完成查找输入操作
                var bookName = $findBook.val();
                $.ajax({
                    type: "get",
                    url: "/search",
                    dataType: "json",
                    data:{name:bookName},
                    success:function (data) {
                        if(data.ret == 1){
                            alert("查找信息成功!");
                            $("#modifyBookID").val(data.ID);
                            $("#modifyBookName").val(data.name);
                            $("#modifyBookTime").val(data.time);
                            $("#modifyBookPrice").val(data.price);
                            $("#modifyBookInfo").show();
                            $("#modifyBookConfig").on('click',function () {
                                $("#modifyBookInfo").hide();
                            });
                        }else{
                            alert("书籍查找失败!");
                        }
                        $findBook.val("");
                    },
                    error:function (e) {
                        alert("error");
                    }
                });
            }
        }
    });
}
//修改书籍按钮
function modifyFun(e) {
    var bookInfo = getInfo(e);
    $("#modifyBookID").val(bookInfo.ID);
    $("#modifyBookName").val(bookInfo.name);
    $("#modifyBookTime").val(bookInfo.time);
    $("#modifyBookPrice").val(bookInfo.price);
    $("#modifyBookInfo").show();
    $("#modifyBookConfig").on('click',function () {
        //更新bookInfo的信息
        bookInfo.name = $("#modifyBookName").val();
        bookInfo.time = $("#modifyBookTime").val();
        bookInfo.price = $("#modifyBookPrice").val();
        if(isNaN($("#modifyBookPrice").val()) == true){
            alert("请输入正确价格！");
            $("#modifyBookPrice").val("");
            return ;
        }
        console.log(bookInfo);
        //发送请求
        $.ajax({
            type: "get",
            url: "/update",
            dataType: "json",
            data:{ID:bookInfo.ID,name:bookInfo.name,time:bookInfo.time,price:bookInfo.price},
            success:function (data) {
                if(data.ret == 1){
                    alert("修改成功!");
                    window.location.reload();
                }
                console.log(data);
            },
            error:function (e) {
                alert("error");
            }
        });
        $("#modifyBookInfo").hide();
    });
    $("#modifyBookCancel").on('click',function () {
        $("#modifyBookInfo").hide();
    })

}
//删除书籍按钮
function deleteFun(e) {
    var bookInfo = getInfo(e);
    var flag = confirm("是否确定删除");
    if(!flag)return ;
//    发送请求
    $.ajax({
        type: "get",
        url: "/delete",
        dataType: "json",
        data:{ID:bookInfo.ID,name:bookInfo.name,time:bookInfo.time,price:bookInfo.price},
        success:function (data) {
            if(data.ret == 1){
                alert("删除成功!");
                window.location.reload();
            }
            console.log(data);
        },
        error:function (e) {
            alert("error");
        }
    });
}

