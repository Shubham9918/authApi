const mongoose = require('mongoose');

function User(modelName, Schema){
    this.init(modelName,Schema);
}

User.prototype.init = (modelName, Schema)=>{
    if(typeof Schema !== 'object'){
        throw new Error("'Schema' is not 'object'");
    }
    if(typeof modelName !== 'string'){
            throw new Error("'modelName' is not 'string'");
    }
    this.modelName = modelName;
    const MongoSchema = mongoose.Schema(Schema);
    this.model = mongoose.model(this.modelName,MongoSchema);
};

User.prototype.getUserByUsername = (data, callback)=>{
    this.model.findOne({username : data})
        .then((res)=>{
            callback(null, res);
        })
        .catch((err)=>{
            callback(err);
        });
};

User.prototype.getProtectedData = (data,callback) => {
    this.model.findOne({username:data})
        .then(res=>{
            callback(null, res);
        })
        .catch(err=>{
            callback(err);
        });
};