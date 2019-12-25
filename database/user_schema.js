//로컬에서도 DB와 비교해서 인증해야하기 때문에 DB와 호흡을 맞춘다.
var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose){
    console.log('createScheme 호출됨.');

    var UserSchema = mongoose.Schema({
        id : {type:String, require:true,unique:true,'default':''},
        hash_password : {type:String, require:true, 'default':''},
        salt:{type:String, required:true},
        email:{type:String, 'default':''},
        name:{type:String, index:'hashed', default:''},
        create_at:{type:Date, index:{unique:false}, 'default':Date.now()},
        updated_at:{type:Date, index:{unique:false}, 'default':Date.now()}
    });
    console.log('UserSchema 정의함.');
    //id라는 칼럼을 먼저 확인한다. id가 있어야 인증이 가능하다..
    UserSchema.path('id').validate(function(id){
        return id.length;           //function(id)로 id가 있는 경우
    }, 'id의 칼럼의 값이 없습니다.');   //id가 없는 경우


    UserSchema
        .virtual('password')
        .set(function(password){
            this.salt = this.makeSalt();
            this.hash_password = this.encryptPassword(password);
            console.log('virtual password 저장됨 : ' + this.hash_password);
        });

    UserSchema.method('encryptPassword', function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        }else{
            return crypto.createHmac('sha1',this.salt).update(plainText).digest('hex');
        }
    });

    UserSchema.method('makeSalt', function(){
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    UserSchema.method('authenticate', function(plainText, inSalt, hash_password){
        if(inSalt){
            console.log('authenticate1 호출됨.');
            return this.encryptPassword(plainText, inSalt) === hash_password;
        }else{
            console.log('authenticate2 호출됨.');
            return this.encryptPassword(plainText) === hash_password;
        }
    });
    UserSchema.static('findById', function(id, callback){
        return this.find({id:id}, callback);
    });

    UserSchema.static('findAll', function(callback){
        return this.find({}, callback);
    });

    return UserSchema;
}

module.exports = Schema;