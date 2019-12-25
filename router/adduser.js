var adduser = function(req, res){
    console.log('/process/adduser 라우팅 함수 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    console.log('요청 파라미터 : ' + paramId + ' , ' + paramPassword + ' , ' + paramName);

    var database = req.app.get('database');
    if(database){
        addUser(database, paramId, paramPassword, paramName, 
            function(err, result){
                console.log(err);
                if(err){
                    console.log('에러 발생1');
                    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                    res.write('<h1>에러 발생</h1>');    
                    res.end();
                }

                if(result){                    
                    console.dir(result);
                    res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                    var context = {
                            userid:result.id,
                            username:result.name
                        };                 
                    req.app.render('add_success',context, function(err, html){
                        if(err){
                            console.log('뷰 렌더링 중 에러 발생 : ' + err.stack);
                            console.log('에러 발생.4');
    
                            res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                            res.write('<h1>뷰 렌더링 중 에러 발생.</h1>');
                            res.write('<br><p>'+err.stack + '</p>');
                            res.end();
                            return;
                        }
                        res.end(html);
                    });

                }else{
                    console.log('에러 발생2');
                    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                    res.write('<h1>사용자 데이터 추가 안됨.</h1>');    
                    res.end();
                }
            });
    }else{
        if(err){
            console.log('에러 발생3');
            res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
            res.write('<h1>데이터 베이스 연결 안됨</h1>');    
            res.end();
        }
    }
};

var addUser = function(db, id, password, name, callback){
    console.log('addUser 호출됨 : ' + id + ' , ' + password + ' , ' + name);

    var user = new db.UserModel({"id":id,"password":password,"name":name});

    user.save(function(err){
        if(err){
            callback(err, null);
            return;
        }
        console.log('사용자 데이터 추가함.');
        callback(null, user);
    });
}

module.exports.adduser = adduser;