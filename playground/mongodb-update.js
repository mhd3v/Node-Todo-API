const {MongoClient, ObjectID} = require('mongodb'); //pull out MongoClient and ObjectID from require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {

    if(err)
        return console.log("Unable to connect to MongoDB server");
    
    console.log("Connected to MongoDB server");

    const db = client.db('TodoApp');

    //==========================================================================================

    db.collection('Todos').findOneAndUpdate({ //filter
        _id: new ObjectID('5b4cbb916d6c414e19b24e73')
    }, { //update
        $set: { //we have to use update operators
            completed: true
        }
    }, { //options object
        returnOriginal: false
    }).then((res) => {
       console.log(res); 
    });

    //==========================================================================================

    //Task - Update a user document and update age by 10

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b4cbe236d6c414e19b24eff')
    }, {
        $set: {
            name: 'Mahad A'
        },

        $inc: {
            age: 10
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    });

    //client.close();

});