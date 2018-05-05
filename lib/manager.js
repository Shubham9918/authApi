const DbConfig = require('./config/db.config');

function Manager() {
    this.init();
}

Manager.prototype.init = ()=> {};

Manager.prototype.dbConfig = (options) => {
    this.dbOptions = options;
    if (typeof options !== 'object'){
        throw new Error("Bad argument : second argument not a 'object'.");
    }
    const dbConfig = new DbConfig(this.dbOptions.dbURI);
    dbConfig.connect();
};

Manager.prototype.config = (configType, options) => {
   if(typeof configType === "string"){
       switch(configType){
           case "db":
               this.dbConfig(options);
               break;
       }
   }
   else{
       throw new Error("Bad arguments : first argument is not 'string'");
   }
};
