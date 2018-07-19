const MongoClient = require('mongodb').MongoClient; 

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser:  true} , (err, client) => { //mongodb://localhost:27017/TodoApp will create TodoApp database if it doesnt exist

    if(err)
        return console.log('Unable to connect to server');
     
    console.log('Connected to MonogoDB server'); //will not run if error occurs, since control would be returned because of return

    const db = client.db('TodoApp');

    //==========================================================================================

    //collection is equivalent to table in SQL
    //document is equivalent to an idividual row of SQL
    //field/properties are equivalent to a column in SQL

    //==========================================================================================

    // db.collection('Todos').insertOne({  //insertOne lets us insert a document(row) into our collection

    //     text: 'Something to do',
    //     completed: false

    // }, (err, res) => {

    //     if(err)
    //     return console.log('Unable to insert todo', err);

    //     console.log(JSON.stringify(res.ops, undefined, 2)); //res.ops is an array of all documents(objects/rows) that were inserted

    // });

    //==========================================================================================

    // db.collection('Users').insertOne({
    //     //_id: 23, //if not assigned, a default _id would be assigned
    //     name: 'Mahad',
    //     age: 21,
    //     location: 'Islamabad'
    // }, (err, res) => {

    //     if(err)
    //         return console("Error inserting user into collection");
        
    //     console.log(res.ops[0]._id.getTimestamp()); //the _id property's first 4 bytes are the time stamp (that are automatically set by mongo)
        
    // });

    client.close();

});