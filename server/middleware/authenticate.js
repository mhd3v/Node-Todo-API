var {User} = require('./../models/user');

var authenticate = (req, res, next) => {    //defining a middleware

    var token = req.header('x-auth'); //get token set by POST /users

    User.findByToken(token).then((user) => {

        if(!user)   //valid token but user not found
            return Promise.reject(); //catch will run

        req.user = user;
        req.token = token;
        next(); //need to call next otherwise code in GET /users/me wont ever execute

    }).catch((e) => {
        res.status(401).send();
    });
}

module.exports = {authenticate};