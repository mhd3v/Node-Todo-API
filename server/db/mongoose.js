var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //tell mongoose to use default JS promises

mongoose.connect(process.env.MONGODB_URI); 
                                                                                
//we setup a MONGODB_URI with heroku config:set MONGODB_URI=yourUrlHere
//got URL from mLab. Format -> mongodb://<dbuser>:<dbpassword>@ds141221.mlab.com:41221/todo-api

module.exports = {mongoose};