const jwt = require('jsonwebtoken');

function SessionManager(){

}

SessionManager.prototype.create = (data, secret, sesstionTime, cb)=>{
    jwt.sign(data,secret,{expiresIn:sesstionTime}, function(err, hash){
        cb(err, hash);
    });
};

SessionManager.prototype.verify = (data,secret,cb) => {
    jwt.verify(data, secret, function(err, decoded) {
        cb(err,decoded);
    });
};

exports = module.exports = new SessionManager();