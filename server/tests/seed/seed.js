const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const dummyUsers = [{
    //user one -> with token
    _id: userOneId,
    email: 'mahadnex4@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {    
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

var dummyTodos = [{
        text: 'do something',
        completed: false,
        _id: new ObjectID(),
        _creator: userOneId
    }, {
        text: 'second test text',
        _id: new ObjectID(),
        completed: true,
        completedAt: 666,
        _creator: userTwoId
    }
];


const populateTodos = (done) => {
    Todo.remove({}).then(() => {    //remove all todos
        return Todo.insertMany(dummyTodos); //insert dummy todos
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(dummyUsers[0]).save();    //will return a promise
        var userTwo = new User(dummyUsers[1]).save();   //will return another promise
        
        //Promise.all() takes an array of promises, then is called when all promises are resolved
        return Promise.all([userOne, userTwo]);    

    }).then(() => done());  //this then call is coming from the return promise.all()
};

module.exports = {
    dummyTodos, populateTodos, dummyUsers, populateUsers
}