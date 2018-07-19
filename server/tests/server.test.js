const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


var dummyTodos = [{text: 'do something', _id: new ObjectID()}, {text: 'second test text', _id: new ObjectID()}];


//beforeEach lets us run some code before each test
//we're using it so that we can check only if the new note was added or not
beforeEach((done) => {      
    Todo.remove({}).then(() => {
        return Todo.insertMany(dummyTodos);
    }).then(() => done());
}); 

describe('POST /todo', () => {
    it('should create a new todo', (done) => {

        var text = "testing string";

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {

            if(err)
                return done(err);
            //else
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e)); 
        });
    });

    it('should not create todo with invalid body data', (done) => {

        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err)
                return done(err);
                
            //else
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2); //2 already added through dummyTodos[]
                done();
            }).catch((e) => done(e));
        });

    });

});


describe('GET /todo', () =>{

    it('should get all todos', (done) => {

        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done)

    });

});

describe('GET /todo/:id', () => {
    it('should return todo doc', (done) => {
        request(app) 
        .get(`/todos/${dummyTodos[0]._id.toHexString()}`) //cant pass object ID driectly to the url 
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(dummyTodos[0].text);
        })
        .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app)
        .get(`/todos/${(new ObjectID()).toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', () => {
        request(app)
        .get('todos/123')
        .expect(404)
        .end(done);
    });
});