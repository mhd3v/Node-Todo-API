require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var mongoose = require('./db/mongoose'); //we're not requiring plain 'mongoose' here because we want to get the object that cofigured in the mongoose.js file (local export)
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();

const port = process.env.PORT;

//Middleware will fire before all the requests defined after. So in this case above, the body-parser middleware runs before the handler for POST /todos runs.
app.use(bodyParser.json()); //body parser lets us send json to our server

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save(todo).then((doc) => {
        res.send(doc); //if successfully saved to db, send the object back to the requester
    }, (err) => {
        res.status(400).send(err); //we're setting a status of 400 (bad request)
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            todos //send an object instead of the orginal array for future flexibility
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', authenticate, (req, res) => { //url param defined by :anyVarName
    
    var id = req.params.id;

    if(!ObjectID.isValid(id))
        return res.status(404).send();
    
    Todo.findOne({  //only allow logged in user to fetch their own notes through id
        _id: id,
        _creator: req.user._id
    }).then((todo) => {

        if(!todo)
            return res.status(404).send();

        res.send({todo});

    }).catch((err) => {
        res.status(400).send();
    });
    
   
});

app.delete('/todos/:id', authenticate, (req, res) => { //url param defined by :anyVarName
    
    var id = req.params.id;

    if(!ObjectID.isValid(id))
        return res.status(404).send();
    
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {

        if(!todo)
            return res.status(404).send();

        res.send({todo});

    }).catch((err) => {
        res.status(400).send();
    });
    
   
});

app.patch('/todos/:id', authenticate, (req, res) => {

    var id = req.params.id;

    //we're using lodash to insure that only the properties we want can be updated. 
    var body = _.pick(req.body, ['text', 'completed']); //.pick() takes an object and pulls out the given properties if found in the object 

    if(!ObjectID.isValid(id))
        return res.status(404).send();

    if(_.isBoolean(body.completed) && body.completed){ //marking todo as completed
        body.completedAt = new Date().getTime();
    }
    else{   //marking todo as not completed
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set : body}, {
        new: true //same as returnOrginal : true
    }).then((todo) => {

        if(!todo)
        return res.status(400).send();

        res.send({todo});

    }).catch((e) => {
        res.send(400).send();
    });

});

app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);

    var newUser = new User(body);

    newUser.save().then(() => {
        return newUser.generateAuthToken();    //catched by *** then call (right below this)
        //res.send(user);
    }).then((token) => {             // ***
        res.header('x-auth', token).send(newUser);    //when we set a 'x-' header it means we're creating a custom header 
    }).catch((err) => {
        res.status(400).send(err);
    });

});


app.get('/users/me', authenticate, (req, res) => {  //authenticate defined in middleware/authenticate.js
    res.send(req.user); //req.user is set by our authentication middleware method
});

app.post('/users/login', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send();
    });
    
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {    //req.user and req.token is set by our authentication middleware method
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })    
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};