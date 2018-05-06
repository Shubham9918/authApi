const bcrypt= require('bcrypt');
const SessionManager = require('./session.controller');
function Auth(){}

Auth.prototype.authenticate = (options, authOptions, model)=>{
    if(typeof options !== 'object'){
        throw new Error("'options' are not of 'object' type");
    }
    if(typeof options.successRedirect !== 'string' ||
        typeof options.failureRedirect !== 'string' ||
        typeof authOptions.sessionSecret !== 'string' ||
        typeof authOptions.sessionExpirein !== 'string'){
        throw new Error("'Auth options' are not correctly defined");
    }
    return function(req, res, next){
        const userData = {
            username : req.body.username,
            password : req.body.password
        };
        model.getProtectedData(userData.username, (err, resPassword)=>{
            if(typeof resPassword !== 'string'){
                res.redirect(options.failureRedirect);
            }
            else{
                bcrypt.compare(userData.password,resPassword, (err, isMatched)=>{
                    if(err){
                        throw err;
                    }
                    if(isMatched){
                        SessionManager.create({
                                username : userData.username,
                                date : new Date()
                            },
                            authOptions.sessionSecret,
                            authOptions.sessionExpirein,
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
            }
        });
    }
};

Auth.prototype.logout = (options)=>{
    if(typeof options.redirectURL !== 'string'){
        throw new Error("'redirect' is not of 'string' type in options");
    }
    return function (req, res, next){
        res.clearCookie('authApi');
        res.redirect(options.redirectURL);
    }
};

Auth.prototype.isAuthenticated = (options, authOptions)=>{
    if(typeof options !== 'object'){
        throw new Error('options are not as required');
    }
    if(typeof options.failureRedirect !== 'string' ||
        typeof authOptions.sessionSecret !== 'string' ||
        typeof authOptions.sessionExpirein !== 'string'){
        throw new Error("'options' are not correctly defined");
    }
    return function (req, res, next) {
        if(typeof req.cookies.authApi !== 'string'){
            res.redirect(options.failureRedirect);
        }
        else{
            SessionManager.verify(req.cookies.authApi,authOptions.sessionSecret,(err, data)=>{
               if(err){
                   res.redirect(options.failureRedirect);
               }
               else{
                   req.data = data;
                   SessionManager.create({
                       username : data.username,
                       date : new Date()
                   },authOptions.sessionSecret, authOptions.sessionExpirein, (err, token)=>{
                       if(err){
                           res.redirect(options.failureRedirect);
                       }
                       res.cookie('authApi',token);
                       next();
                   });
               }
            });
        }
    };
};

Auth.prototype.isNotAuthenticated = (options,authOptions) => {
    if(typeof options.failureRedirect !== 'string'){
        throw new Error("'options' are not correctly defined");
    }
    return function (req, res, next) {
        if(typeof req.cookies.authApi !== 'string'){
            next();
        }
        else{
            SessionManager.verify(req.cookies.authApi,authOptions.sessionSecret,(err, data)=>{
                if(err){
                    next();
                }
                else{
                    res.redirect(options.failureRedirect);
                }
            });
        }
    };
};

exports = module.exports = new Auth();