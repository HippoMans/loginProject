var listuser = function(req, res){
    console.log('/process/listuser 라우팅 함수 호출됨.');

    var database = req.app.get('database');
    if(database){
        database.UserModel.findAll(function(err, results){
            if(err){
                console.log('에러 발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');    
                res.end();
            }

            if(results){
                console.dir(results);

                var context = {
                    results: results
                };
                req.app.render('listuser',context, function(err, html){
                    if(err){
                        console.log('뷰 렌더링 중 에러 발생 : ' + err.stack);
                        console.log('에러 발생.');

                        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                        res.write('<h1>뷰 렌더링 중 에러 발생.</h1>');
                        res.write('<br><p>'+err.stack + '</p>');
                        res.end();
                        return;
                    }
                    res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                    res.end(html);
                });

            }else{
                console.log('에러 발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>조회된 사용자 없음</h1>');    
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

module.exports.listuser = listuser;