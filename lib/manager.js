const DbConfig = require('./config/db.config');
const User = require('./models/user.model');
const Auth = require('./controllers/auth.controller');

function Manager() {
    this.init();
}

Manager.prototype.init = ()=> {};

Manager.prototype.config = (configType, options) => {
   if(typeof configType === "string"){
       switch(configType){
           case "db":
               this.dbOptions = options;
               if (typeof options !== 'object'){
                   throw new Error("Bad argument : second argument not a 'object'.");
               }
               const dbConfig = new DbConfig(this.dbOptions.dbURI);
               dbConfig.connect();
               this.model = new User(options.modelName,options.Schema);
               break;
           case "auth" :
               if (typeof options !== 'object'){
                   throw new Error("Bad argument : second argument not a 'object'.");
               }
               this.defaultAuthOptions = options;
       }
   }
   else{
       throw new Error("Bad arguments : first argument is not 'string'");
   }
};

Manager.prototype.authenticate = (options)=>{
    return Auth.authenticate(options || this.defaultAuthOptions, this.model);
};
Manager.prototype.logout = (options)=>{
    return Auth.logout(options);
};

exports = module.exports = Manager;