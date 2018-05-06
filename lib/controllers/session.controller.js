const jwt = require('jsonwebtoken');

function SessionManager(){

}

SessionManager.prototype.create = (data, secret, sesstionTime, cb)=>{
    jwt.sign(data,secret,{expiresIn:sesstionTime}, function(err, hash){
        cb(err, hash);
    });
};


exports = module.exports = new SessionManager();