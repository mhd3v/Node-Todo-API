const {SHA256} = require('crypto-js');  //this is only for playground (hashing concepts) 
const jwt = require('jsonwebtoken');    //this eases the task of hashing. 



// var message = SHA256("hello world!").toString();

// console.log(message);

// //lets say we have an obj that is sent to the user by the server

// var data = {
//     id: 3
// };

// var token = {   //we send the object along with the hash string. here 'secret salt' is our salt
//     data,
//     hash: SHA256(JSON.stringify(data)+"secret salt").toString() 
// }

// //============== Simulating middle-man manipulation

// data.id = 5;
// token.hash = SHA256(JSON.stringify(data)).toString(); // attacker will regenerate new hash. but this won't be correct since they wont know the hash

// //============== checking user's response

// var hashRes = SHA256(JSON.stringify(token.data)+"secret salt").toString();

// if(hashRes === token.hash)
//     console.log('Data was not changed');
// else
//     console.log('Data changed');

//=======================================================================================================================================================

var data = {
    id: 10
}

var token = jwt.sign(data, '123abc'); //sign takes the data and the salt. returns a token

console.log(token);

var decoded = jwt.verify(token, '123abc');    

console.log('decoded', decoded);