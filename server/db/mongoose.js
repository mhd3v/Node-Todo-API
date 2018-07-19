var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //tell mongoose to use default JS promises

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};