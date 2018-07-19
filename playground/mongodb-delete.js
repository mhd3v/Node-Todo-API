const {MongoClient, ObjectID} = require('mongodb'); //pull out MongoClient and ObjectID from require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {

    if(err)
        return console.log("Unable to connect to MongoDB server");
    
    console.log("Connected to MongoDB server");

    const db = client.db('TodoApp');

    //==========================================================================================

    //deleteMany

    // db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((res) => {
    //     console.log(res);
    // });

    //==========================================================================================

    //deleteOne

    // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((res) => {
    //     console.log(res);
    // });

    //==========================================================================================

    //findOneAndDelete (deletes and returns the deleted obj)

    // db.collection('Todos').findOneAndDelete({completed: false}).then((res) => {
    //     console.log(res);
    // });

    //==========================================================================================

    //challenge - Part(1) - delete duplicates

    db.collection('Users').deleteMany({name: 'Mahad'}).then((res) => {
        console.log(res);
    });

    //challenge - Part(2) - delete by ID

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5b4b859b6d6c414e19b23c00')
    }).then((res) => {
        console.log(res);
    });

    //==========================================================================================


    //client.close();

});