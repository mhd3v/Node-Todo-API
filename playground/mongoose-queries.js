const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
// var id = '6b4f531d2298842cdcb408dd11';

// if(!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }

// Todo.find({     //returns [] if no todo
//     _id: id     //moogose automatically converts string id to ObjectID
// }).then((todos) => {
//     console.log(todos);
// });

// Todo.findOne({  //returns first doc, returns null if not found
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo)
//         return console.log('Id not found');
//     console.log('Todo by id', todo);
// }).catch((err) => console.log(err));

//========================================================
// find user by id:

var id = '5b4ccca6e1f8830c8cb4f951';

User.findById(id).then((user) => {
    if(!user) //null returned
        return console.log('user not found');

    console.log(user);
}).catch((err) => {
    console.log(err);
});
    
    


