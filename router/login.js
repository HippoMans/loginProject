var login = function(req, res){
    console.log('/process/login 라우팅 함수 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ' , '+paramPassword);

    var database = req.app.get('database');
    if(database){
        authUser(database, paramId, paramPassword, function(err, docs){
            if(err){
                console.log('에러 발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');    
                res.end();
                return;
            }
            if(docs){
                console.dir(docs);
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                var context = {
                    userid:paramId,
                    username:docs[0].name
                };
                req.app.render('login_success',context, function(err, html){
                    if(err){
                        console.log('뷰 렌더링 중 에러 발생 : ' + err.stack);
                        console.log('에러 발생.');

                        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                        res.write('<h1>뷰 렌더링 중 에러 발생.</h1>');
                        res.write('<br><p>'+err.stack + '</p>');
                        res.end();
                        return;
                    }
                    res.end(html);
                });
                
            } else{
                console.log('에러 발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터 조회 안됨.</h1>');    
                res.end();
            }
        });
    }else{
        if(err){
            console.log('에러 발생');
            res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
            res.write('<h1>데이터 베이스 연결 안됨</h1>');    
            res.end();
        }
    }
};

//인증하는 함수
var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨 : ' + id + ' , ' + password);

    db.UserModel.findById(id, function(err, results){
        if(err){
            callback(err, null);
            return;
        }
        console.log('아이디 %s로 검색됨.');
        if(results.length>0){
            var user = new db.UserModel({id:id});
            var authenticate = user.authenticate(password, 
                results[0]._doc.salt, results[0]._doc.hash_password);

            if(authenticate){
                console.log('비밀번호 일치함.');
                callback(null, results);
            }else{
                console.log('비밀번호 일치하지 않음.');
                callback(null, null);
            }
        }else{
            console.log('아이디 일치하는 사용자 없음.');
            callback(null, null);
        }
    });
};


module.exports.login = login;