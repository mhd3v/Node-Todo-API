var env = process.env.NODE_ENV || 'development'; 
//process.env.NODE_ENV will be set to test if we're running test script. 
//It will be set to 'production' if running from heroku
//if not it we will set env to development

if(env === 'development'){
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
    process.env.PORT = 3000;
}

else if(env === 'test'){
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
    process.env.PORT = 3000;
}
