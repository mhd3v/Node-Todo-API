var env = process.env.NODE_ENV || 'development'; 
//process.env.NODE_ENV will be set to test if we're running test script. 
//It will be set to 'production' if running from heroku
//if not it we will set env to development

if(env === 'development' || env === 'test'){
    var config = require('./config.json'); //json will automatically be parsed into a JS object
    var envConfig = config[env]; //will get the appropriate object from the config object according to the env variable

    Object.keys(envConfig).forEach((key) => {   //object.keys will return name of each property of an object
        process.env[key] = envConfig[key];
    });

}

// if(env === 'development'){
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
//     process.env.PORT = 3000;
// }

// else if(env === 'test'){
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
//     process.env.PORT = 3000;
// }
