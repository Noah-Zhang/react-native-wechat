var express = require('express');
var app = require('../app');
var router = express.Router();
var User = require('../model/user');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var settings = require('../settings');
var flash = require('connect-flash');
/* GET home page. */

router.get('/', function (req, res) {
    //这里只拿token来作为参数传递
    //1.如何查看头,头是一个json,直接点或者按照数组传参的方式查看(对应于带特殊标记符的参数)
    //解析出了token。。
    // console.log(req.headers);
    var token = tokenParson(req);
    if (token == null) {
        console.log(token);
        res.redirect('index');
    }else if(token==-1){
        res.redirect('index');
    }else {
        console.log(token + '------');
        auto1(token, res);
    }
    //判断方法
    // console.log(req.get('token')==null);
    // console.log('user-agent:'+head['user-agent']);
    //2.客户端如何获取服务端产生的token,并且将其设置到请求头中.
    // console.log(req.headers['token']);
    // console.log(req.hostname);
    // console.log(req.session.token);
    // console.log(req.headers);
    /*
     //第一版
     if(req.session.token!=null){
     //有token,先验证token,然后再决定跳转..
     console.log('here?????......');
     var decode=jwt.verify(req.session.token,settings.cookieSecret);
     // console.log(decode.id+"------"+decode.password);
     var id=decode.id;
     User.get(id,function (err,user){
     if(!user){
     console.log('用户不存在..');
     return res.redirect('index');
     }
     // req.session.user=user;
     return res.redirect('chat');
     // res.render('chat',{title:req.session.user.id});
     })
     }else{
     //token占时没有保存,导致每次都没有token。。
     return res.redirect('index');
     }
     */
    // if(req.cookies[token]!=null){
    //    console.log(req.cookies[token]);
    // }else{
    //       console.log(req);
    //       req.header('cookies');
    // }

    // auth(req,res);
});

router.get('/index', function (req, res) {

    // console.log(req.headers);
    res.render('index', {title: "请登录"});
});

router.post('/index', function (req, res) {
    // console.log(req.body.id);
    // res.send(req.body.password);zby
    // console.log(req.body.username+":"+req.body.pwd);
    // return res.json({name:req.body.username,pwd:req.body.pwd});

    //token验证 post一个token
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    // var user=new User({id:req.body.id,password:password,token:null});

    User.get(req.body.id, function (err, user) {
        if (!user) {
            console.log('用户不存在');
            return res.redirect('index');
        }
        if(user.password==password){

        }
        // user={id:req.body.id,password:req.body.password,token:}
        // req.session.user=user;
        //这里也需要传递id..
        // var token = jwt.sign({id: req.body.id, password: password}, settings.cookieSecret, {expiresIn: 3600000});
        // res.cookie('token', token, {maxAge: 3600000});
        // return res.redirect('chat');
        // return res.status(200).json({success:"true"});
        // res.render('chat',{title:req.session.user.id});
    })
});

router.get('/chat', function (req, res) {
    //如果直接登录chat则要验证.
    var token = tokenParson(req);
    console.log('token:'+'-----???'+token);
    if(token==null){
        res.redirect('index');
    }else if(token==-1){
        res.redirect('index');
    }
    var decode = jwt.verify(token, settings.cookieSecret);
    // res.render('chat', {title: decode.id});

    var id = decode.id;
    User.get(id, function (err, user) {
        if (!user) {
            console.log('用户不存在..');
            return res.redirect('index');
        }
        console.log("gerhrere?");
        // req.session.user=user;
        return res.render('chat',{title:id});
    });




    // res.render('chat',{title:decode.id});
});

router.get('/test', function (req, res) {
    return res.render('test');
});
router.get('/register', function (req, res) {
    res.render('register');
});
router.post('/register', function (req, res) {
    var id = req.body.id,
        password = req.body.password,
        repassword = req.body['repeat-password'];
    if (password != repassword) {
        // console.log('password not right');
        return res.redirect('register');
    }
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    // jwt.verify(token,settings.cookieSecret,function (err,decoded) {
    //    if(err){
    //        console.log('err..');
    //    }else{
    //        console.log(decoded.id+':'+decoded.password+'???????');
    //    }
    // });
    var userInfo = new User({id: req.body.id, password: password});
    User.get(userInfo.id, function (err, user) {
        if (err) {
            console.log('err..');
            return res.redirect('register');
        }
        if (user) {
            console.log('用户已经存在,重新注册..');
            return res.redirect('register');
        }
        //传入的数据是user
        userInfo.save(function (err, user) {
            if (err) {
                console.log('err..');
                return res.redirect('register');
            }

            // res.append('token',token);
            // console.log(res.get('token'));
            // console.log('------------'+res.headers);
            //将token作为请求头返回
            // console.log(req.headers);
            // req.headers['token']=token;
            // console.log(req.headers);

            //token 有效期两个小时
            var token = jwt.sign({id: req.body.id, password: password}, settings.cookieSecret, {expiresIn: 3600000});
            // tokenVal=token;
            // req.session.token=token;
            // req.setHeader({'Set-Cookie':'token="token"'});
            res.cookie('token', token, {maxAge: 3600000});
            // req.session.user={'id':req.body.id,'password':password};
            return res.redirect('chat');
        })
    });
});


router.post('/chat', function (req, res) {

});

router.get('/logout', function (req, res) {
    console.log('here');
    //退出登陆赋值token 为-1标注为登出状态
    res.cookie('token',-1);
    res.render('index', {title: '已登出'});
});

router.get('/data', function (req, res) {
    // console.log(onLineList);
    // return res.send('dsada');
    // console.log(arr.toString()+'....');
    return res.send(arr.toString());
});


//请求解析->token
function tokenParson(req) {
    var Cookies = {};
    console.log(req.headers.cookie);
    // if (req.headers.cookie) {
        req.headers.cookie.split(';').forEach(function (Cookie) {
            var parts = Cookie.split('=');
            // console.log(parts);
            Cookies[parts[0].trim()] = ( parts[1] || '' ).trim();
        });
        //因为req.headers.cookie是字符串,要先解析
        if(Cookies.hasOwnProperty('token')){
            if(Cookies['token']==1){
                return null;
            }
            var token = Cookies['token'];
            return token;
        }else{
            return null;
        }
    //cookies中token存在吗???1.不存在->index->登陆2.存在->auto1();
}

//token->id
function userInfo(token) {
    var decode = jwt.verify(token, settings.cookieSecret);
    // console.log(decode.id+"------"+decode.password);
    var id = decode.id;
    return id;
}
//token->验证->跳转
function auto1(token, res) {
    // if(true){
    var decode = jwt.verify(token, settings.cookieSecret);
    console.log(decode);
    // console.log(decode.id+"------"+decode.password);
    //1.首先判断过期没???下面的有问题
    if (decode.exp<=Date.now()) {
        console.log('exp???date.now');
        res.cookie('token',-1);
        return res.redirect('index');
    }
    console.log('exp>>dataNow');
    //没过期 =>看一下token对不对
    var id = decode.id;
    User.get(id, function (err, user) {
        if (!user) {
            console.log('用户不存在..');
            return res.redirect('index');
        }
        console.log("gerhrere?");
        // req.session.user=user;
        return res.redirect('chat');
        // res.render('chat',{title:req.session.user.id});
    })
    // }else{
    //     res.redirect('index');
    // }

}


module.exports = router;
