var mongoose = require('mongoose');

//==========================================================================================
//Task - Make User model (email - require it - trim it - set type - set min length)

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

// var newUser = new User({
//     email: 'mhd3v@mhd3v'
// });

// newUser.save().then((doc) => {
//     console.log('Saved user', doc);
// }, (err) => {
//     console.log('Unable to save user');
// });

module.exports = {User};