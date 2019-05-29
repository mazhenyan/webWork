var express = require("express");
var url = require("url");
var fs = require("fs");
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/"));
app.set("view engine","ejs");
app.use(session({
    resave : true,
    saveUninitialized: false,
    name: '0123456789AB',
    secret : '20190528',
    cookie : { maxAge : 1000 * 60 * 20}
}));
app.get("/",function (req,res) {
    fs.readFile(__dirname+"/views/index.html","utf-8",function(e,data){
        res.write(data);
        res.end();
    });
});
app.post("/login",function (req,res) {
    var userID = req.body.userID;
    var password = req.body.password;
//    验证账号和密码
    fs.readFile(__dirname+"/public/json/user.json","utf-8",function(e,data){
        var status = new Object();
        if(e){
            status.ret = 9;
        }else{
            status.ret = 0;
            var json = JSON.parse(data);
            for (var i = 0;i<json.length;i++){
                if(json[i].userID == userID){
                    if(json[i].password == password){
                        status.ret = 1;
                        //设置session
                        req.session.userID = userID;
                        req.session.password = password;
                        break;
                    }
                    status.ret = 2;
                }
            }
            res.send(JSON.stringify(status));
            return ;
        }
    });
});
app.get("/main",function (req,res) {
    if(req.session && req.session.userID && req.session.password)
        res.render("main");
});
app.get("/getInfo",function (req,res) {
//    返回书籍信息
    fs.readFile(__dirname+"/public/json/book.json","utf-8",function(e,data){
        var books = [];
        var status = new Object();
        if(e){
            status.ret = 0;
            console.log("服务器异常");
        }else{
            status.ret = 1;
            books.push(status);
            var json = JSON.parse(data);
            for (var i = 0;i<json.length;i++){
                var bookInfo = new Object();
                bookInfo.ID = json[i].ID;
                bookInfo.name = json[i].name;
                bookInfo.time = json[i].time;
                bookInfo.price = json[i].price;
                books.push(bookInfo);
            }
            res.send(JSON.stringify(books));
            return ;
        }
    });
});
app.get("/delete",function (req,res) {
    var query = url.parse(req.url,true).query;
    fs.readFile(__dirname+"/public/json/book.json","utf-8",function(e,data){
        var books = [];
        var status = new Object();
        if(e){
            status.ret = 9;
        }else{
            status.ret = 0;
            var json = JSON.parse(data);
            for (var i = 0;i<json.length;i++){
                if(json[i].ID == query.ID){
                    //删除成功
console.log("删除成功");
                    status.ret = 1;
                    continue;
                }
                //重新写book.json文件
                var bookInfo = new Object();
                bookInfo.ID = json[i].ID;
                bookInfo.name = json[i].name;
                bookInfo.time = json[i].time;
                bookInfo.price = json[i].price;
                books.push(bookInfo);
            }
        //    将新的书籍信息写入book.json中
                fs.writeFile(__dirname+"/public/json/book.json",JSON.stringify(books),function (e) {
                    if(e){
console.log("error");
                    }else{
console.log("写入文件成功");
                    }
                });
        }
        res.send(JSON.stringify(status));
    });
});
app.get("/update",function (req,res) {
    var query = url.parse(req.url,true).query;
    fs.readFile(__dirname+"/public/json/book.json","utf-8",function(e,data){
        var books = [];
        var status = new Object();
        if(e){
            status.ret = 9;
        }else{
            status.ret = 0;
            var json = JSON.parse(data);
            for (var i = 0;i<json.length;i++){
                if(json[i].ID == query.ID){
                    //删除成功
                    var bookInfo = new Object();
                    bookInfo.ID = query.ID;
                    bookInfo.name = query.name;
                    bookInfo.time = query.time;
                    bookInfo.price = query.price;
                    books.push(bookInfo);
                    console.log("修改成功");
                    status.ret = 1;
                    continue;
                }
                //重新写book.json文件
                var bookInfo = new Object();
                bookInfo.ID = json[i].ID;
                bookInfo.name = json[i].name;
                bookInfo.time = json[i].time;
                bookInfo.price = json[i].price;
                books.push(bookInfo);
            }
            //    将新的书籍信息写入book.json中
            fs.writeFile(__dirname+"/public/json/book.json",JSON.stringify(books),function (e) {
                if(e){
                    console.log("error");
                }else{
                    console.log("写入文件成功");
                }
            });
        }
        res.send(JSON.stringify(status));
    });
});
app.get("/search",function (req,res) {
    var bookInfo = new Object();
    var name = url.parse(req.url,true).query.name;
    fs.readFile(__dirname+"/public/json/book.json","utf-8",function(e,data){
        if(e){
            bookInfo.ret = 9;
        }else{
            bookInfo.ret = 0;
            var json = JSON.parse(data);
            for (var i = 0;i<json.length;i++){
                if(json[i].name == name){
                    bookInfo.ret = 1;
                    bookInfo.ID = json[i].ID;
                    bookInfo.name = json[i].name;
                    bookInfo.time = json[i].time;
                    bookInfo.price = json[i].price;
                    break;
                }
            }
        }
        res.send(JSON.stringify(bookInfo));
        res.end;
    });
});
app.get("/increase",function (req,res) {
    var query = url.parse(req.url,true).query;
    var newBookInfo = new Object();
    newBookInfo.ID = query.ID;
    newBookInfo.name = query.name;
    newBookInfo.time = query.time;
    newBookInfo.price = query.price;
    fs.readFile(__dirname+"/public/json/book.json","utf-8",function(e,data){
        var books = [];
        var status = new Object();
        if(e){
            status.ret = 9;
        }else{
            status.ret = 1;
            var json = JSON.parse(data);
            for (var i = 0;i<json.length;i++){
                //重新写book.json文件
                var bookInfo = new Object();
                bookInfo.ID = json[i].ID;
                bookInfo.name = json[i].name;
                bookInfo.time = json[i].time;
                bookInfo.price = json[i].price;
                books.push(bookInfo);
            }
            books.push(newBookInfo);
            //    将新的书籍信息写入book.json中
            fs.writeFile(__dirname+"/public/json/book.json",JSON.stringify(books),function (e) {
                if(e){
                    console.log("error");
                }else{
                    console.log("写入文件成功");
                }
            });
        }
        res.send(JSON.stringify(status));
    });
});
app.listen(50103,"127.0.0.1");