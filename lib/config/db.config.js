const mongoose = require('mongoose');

function DbConfig(dbURI){
    this.init(dbURI);
}

DbConfig.prototype.init = (dbURI)=>{
    this.dbURI = dbURI;
};


DbConfig.prototype.connect = ()=>{
    console.info('Connecting Database....');
    if(typeof this.dbURI !== 'string'){
        throw new Error("'dbURI' is not of type 'string'");
    }
    return mongoose.connect(this.options.dbURI)
        .then(()=>{
            console.info('Database connected...');
        })
        .catch((err)=>{
            throw err;
        });
};

DbConfig.prototype.disconnect = () => {
  mongoose.close();
};


exports = module.exports = DbConfig;