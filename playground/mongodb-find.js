//==========================================================================================
//destructuring (making varaibles from an object's property (ES6 syntax))

// var myObj = {name: 'mahad', age: 12};
// var {name} = myObj;
// console.log(name);

//==========================================================================================

const {MongoClient, ObjectID} = require('mongodb'); //pull out MongoClient and ObjectID from require('mongodb')

//==========================================================================================
// var obj = new ObjectID(); //this will generate a unique mongo obj id
// console.log(obj);
//==========================================================================================

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {

    if(err)
        return console.log("Unable to connect to MongoDB server");
    
    console.log("Connected to MongoDB server");

    const db = client.db('TodoApp');

    //==========================================================================================

    //client.collection('Todos').find(); returns a mongodb cursor
    //client.collection('Todos').find().toArray() toArray returns a promise

    // db.collection('Todos').find({ // specify query as a set of key value pairs to find()
    //     _id: new ObjectID('5b4b650f06cb0d2010e177c0')
    
    // }).toArray().then((res) => { 

    //     console.log('Todo List: ');
    //     console.log(JSON.stringify(res, undefined, 2));

    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    //==========================================================================================

    // db.collection('Todos').find({ // specify query as a set of key value pairs to find()
        
    //     //specify query here, as key-value pairs
    //     //_id: new ObjectID('5b4b650f06cb0d2010e177c0')
    
    // }).count().then((count) => { 

    //     console.log(`Todo count: ${count} `);

    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    //==========================================================================================


    db.collection('Users').find({name: 'Mahad'}).toArray().then((documents) => {
        console.log(JSON.stringify(documents, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch to-dos', err);
    });

    //client.close();

});