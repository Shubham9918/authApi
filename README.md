# nodeAuthApi
This library use for authentication work as middleware. As of now you can add login feature to your app. 
Some feature like authenticate, manage authenticated URL and unauthenticated URL etc.. 
This API is totally based on local strategy (i.e. you can authenticate using only your database not 3rd party authentication).

## Install
```
    $ npm i nodeauthapi 
```

## Usage
##### Create application *(config)*
Before using this API you have to initialize any app. We are using the 
[Express](http://expressjs.com/en/starter/installing.html) framework for explaining this API. 
To initialize the Express app follow the following commands:
```
    $ express --version
    $ cd ~/Desktop
    $ express --view=ejs myapp
    $ cd myapp
    $ npm install
    $ npm install nodeauthapi
```

##### Configure database and authentication
For configuring the database and authentication API have a function [config()](/blob/master/lib/manager.js) in 
[manager.js](/blob/master/lib/manager.js). To configure the database pass fist parameter in as `config('db',options)` 4
and for authentication config pass `config('auth',options)`, `options` are different for both configuration.<br> 
Follow the following code:
```javascript
    const nodeAuthApi = require('nodeauthapi');
    //for database config
    nodeAuthApi.config('db',{
        dbURI:'mongodb://127.0.0.1/test', //Your hosted mongodb URI,
        modelName:'users',//Name of model you want to create
        Schema : {
            //username, password and email are required
            username:{
                type : String,
                required:true
            },
            password:{
                type:String,
                required:true,
                bcrypt:true
            },
            email:{
                type:String,
                required:true
            },
            name:{
                type:String
            }
        } // Schema object is for database schema
    });
    
    //for authentication config
    nodeAuthApi.config('auth',{
        sessionSecret : 'secret', // secret for json web token
        sessionExpirein : '1m' // session expire time
    });
```
`Configure the API before configuring any routers.`
##### Authenticate Requests
Use `nodeAuthApi.authenticate()`, for authnticating the request. This function contain one parameter `options`
and it is object containing `successRediect, failureRedirect`.<br>
For example, as route middleware in an [Express](http://expressjs.com/en/starter/installing.html) application:
```javascript
    app.post('/login', nodeAuthApi.authenticate({
        successRediect : '/dashboard', // redirect to this route if successfully logged in
        failureRedirect : '/login' // redirect when fail to authenticate
    }));
```
##### Other
Here we are discuss about other API like `logout()`,`isAuthenticated()`,`isNotAuthenticated()`:<br>
* Use of `logout()`
```javascript
    //For logout the session
    app.get('/logout',nodeAuthApi.logout({
        redirectURI:'/login' // URI for redirecting after logout
    }));
```
* Use of `isAuthenticated()`<br>
```javascript
    //For verifying that user are authenticated are not
    app.get('/dashboard',nodeAuthApi.isAuthenticated({
        failureRedirect : '/login' // redirect user when not authenticated
    }),(req, res, next)=>{
        res.send('Protected page'); //User request jump to next middleware if user is authenticated
    });
```
* Use of `isNotAuthenticated()`<br>
```javascript
    //For verifying that user are already logged in OR not
    app.get('/dashboard',nodeAuthApi.isNotAuthenticated({
        failureRedirect : '/dashboard' // redirect user when authenticated
    }),(req, res, next)=>{
        res.send('Login Page'); //User request jump to next middleware if user is not authenticated
    });
```
## License
[The MIT License](https://opensource.org/licenses/MIT)<br>
Copyright (c) 2018 Shubham Srivastava
