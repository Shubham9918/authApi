const jwt = require('jsonwebtoken');

function SessionManager(){

}

SessionManager.prototype.create = (data, secret, sesstionTime, cb)=>{
    let token = jwt.sign(data,secret,{expiresIn:sesstionTime});
    token
        .then(res=>{
            cb(null, res);
        })
        .catch(err=>{
            cb(err);
        });
};


exports = module.exports = new SessionManager();