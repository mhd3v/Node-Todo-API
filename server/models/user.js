const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
//==========================================================================================
//Task - Make User model (email - require it - trim it - set type - set min length)

var UserSchema = new mongoose.Schema({      //we have put the obj inside the schema method since we want to make a custom method for the user schema
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true, //this ensures that only unqiue emails (that don't exist in the db can be added)
        validate: {
            validator : validator.isEmail, //validator expects a fuction that will either return true or false
            message: "{VALUE} is not a valid email"
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    tokens: [{
        access: {
            type: String,
            required: true
        },

        token: {
            type: String,
            required: true
        }
    }]

});

UserSchema.methods.toJSON = function () {    //overriding built in method (we want user to only get limited info back)
    var user = this;
    var userObject = user.toObject(); //mongoose object to java script obj
    
    return _.pick(userObject, ['_id', 'email']);    //dont send security related data back to user
};

UserSchema.methods.generateAuthToken = function () {    //can add any instance method we like. We have added this method to save the token in the database and return it to server.js 
    //this method run for a given user object. that is, we run after the doc has been inserted into the db
    var user = this; //we didnt use a cb function since we want to use 'this'
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    //user.tokens.concat([{access, token}]); //concat into the tokens array
    user.tokens.push({access, token});

    return user.save().then(() => {     //we're returning this promise so that we can catch it in server.js using a chained promise
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {    //pull operator lets us pull out a wanted object 
            tokens: {   //pull from token array the token object with the same properties as the token passed into the method
                token : token   //whole token object is remove
            }
        }
    });
};

//define Model method (not an instance method like generateAuthToken), i.e. static method
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try{
       decoded = jwt.verify(token, 'abc123');
    }
    catch(e) {  //if theres a problem, we will return a promise that is caught by server.js
        // return new Promise((resolve, reject) => {
        //     reject();
        // }); 
        // same but much simpler syntax
        return Promise.reject(); //any argument in reject will be used as err message by catch
    }

    return User.findOne({   //find user against the given token
        '_id': decoded._id,
        'tokens.token': token,  //quotes are required when we have a . in the value
        'tokens.access': 'auth'
    }); //since we're returning this, the promise can be caught in server.js
};


UserSchema.statics.findByCredentials = function (email, password) {

    var User = this;

    return User.findOne({email}).then((user) => {

        if(!user)
        return Promise.reject();

        return new Promise((resolve, reject) => {   //we're defining a new promise here since bcrypt doesn't support promises

            bcrypt.compare(password, user.password, (err, res) => {
                
                if(res)
                resolve(user);

                else
                reject();
                
            });

        });

    });

};

UserSchema.pre('save', function(next) {   //mongoose middleware, this is going to run before save is called

    var user = this;
    
    if(user.isModified('password')){    //checking to see if password is already hashed

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
       
    else{
        next();
    }
});    

var User = mongoose.model('User', UserSchema);

// var newUser = new User({
//     email: 'mhd3v@mhd3v'
// });

// newUser.save().then((doc) => {
//     console.log('Saved user', doc);
// }, (err) => {
//     console.log('Unable to save user');
// });

module.exports = {User};