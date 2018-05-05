const bcrypt= require('bcrypt');
const SessionManager = require('./session.controller');
function Auth(){

}

Auth.prototype.authenticate = (options, model)=>{
    if(typeof options !== 'object'){
        throw new Error("'options' are not of 'object' type");
    }
    if(typeof options.successRedirect !== 'string' ||
        typeof options.failureRedirect !== 'string' ||
        typeof options.sessionSecret !== 'string' ||
        typeof options.sessionExpirein !== 'string'){
        throw new Error("'Auth options' are not correctly defined");
    }
    return function(req, res, next){
        const userData = {
            username : req.body.username,
            password : req.body.password
        };
        model.getProtectedData(userData.password, (err, resPassword)=>{
            bcrypt.compare(userData.password,resPassword, (err, isMatched)=>{
                if(err){
                    throw err;
                }
                if(isMatched){
                    SessionManager.create({
                            username : userData.username,
                            date : new Date()
                        },
                        options.sessionSecret,
                        options.sessionExpirein,
                        (err, token)=>{
                            if (err){
                                throw err;
                            }
                            res.cookie('authApi',token);
                            res.redirect(options.successRedirect);
                        }
                    );

                }
                else{
                    res.redirect(options.failureRedirect);
                }
            });
        });
    }

};

Auth.prototype.logout = (options)=>{
    if(typeof options.redirectURL !== 'string'){
        throw new Error("'redirect' is not of 'string' type in options");
    }
    return function (req, res, next){
        res.clearCookie();
        res.redirect(options.redirectURL);
    }
};

exports = module.exports = new Auth();