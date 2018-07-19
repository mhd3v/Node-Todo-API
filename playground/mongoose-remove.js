const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// Todo.remove({}).then((res) => {
//     console.log(res);
// }); //delete everything 

//Todo.findOneAndRemove() //delete a doc and return it
//Todo.findByIdAndRemove()

Todo.findByIdAndRemove('5b50e06d6d6c414e19b2649a').then((todo) => {
    console.log(todo);
});