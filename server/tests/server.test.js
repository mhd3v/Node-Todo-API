const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {dummyTodos, populateTodos, dummyUsers, populateUsers} = require('./seed/seed');


//beforeEach lets us run some code before each test (i.e. before each it() call)

beforeEach(populateUsers); 
beforeEach(populateTodos); 

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = "testing string";

        request(app)
        .post('/todos')
        .set('x-auth', dummyUsers[0].tokens[0].token)
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
        .set('x-auth', dummyUsers[0].tokens[0].token)
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


describe('GET /todos', () =>{

    it('should get all todos', (done) => {

        request(app)
        .get('/todos')
        .set('x-auth', dummyUsers[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done)

    });

});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app) 
        .get(`/todos/${dummyTodos[0]._id.toHexString()}`) //cant pass object ID driectly to the url 
        .set('x-auth', dummyUsers[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(dummyTodos[0].text);
        })
        .end(done);
    });

    it('should not return a todo doc created by another user', (done) => {
        request(app) 
        .get(`/todos/${dummyTodos[1]._id.toHexString()}`) //cant pass object ID driectly to the url 
        .set('x-auth', dummyUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app)
        .get(`/todos/${(new ObjectID()).toHexString()}`)
        .set('x-auth', dummyUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get('/todos/123')
        .set('x-auth', dummyUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {

    it('should remove a todo', (done) => {

        var id = dummyTodos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', dummyUsers[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(id);
        })
        .end((err, res) => {
            if(err)
                return done(err);
            
            Todo.findById(id).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((err) => done(err));

        });
    });

    it('should not remove a todo created by another user', (done) => {

        var id = dummyTodos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', dummyUsers[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
            if(err)
                return done(err);
            
            Todo.findById(id).then((todo) => {
                expect(todo).toExist();
                done();
            }).catch((err) => done(err));

        });
    });

    it('should return a 404 if todo not found', (done) => {
        request(app)
        .delete(`/todo/${new ObjectID().toHexString}`)
        .set('x-auth', dummyUsers[1].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if ObjectID is invalid', (done) => {
        request(app)
        .delete(`/todo/123`)
        .set('x-auth', dummyUsers[1].tokens[0].token)
        .expect(404)
        .end(done);
    });

});


describe('PATCH /todos/:id', () => {

    it('should update the todo', (done) => {

        var hexId = dummyTodos[0]._id.toHexString();

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', dummyUsers[0].tokens[0].token)
        .send({"text" : "supertest","completed": true})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe("supertest");
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);

    });

    it('should not update the todo created by another user', (done) => {

        var hexId = dummyTodos[1]._id.toHexString();

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', dummyUsers[0].tokens[0].token)
        .send({"text" : "supertest","completed": true})
        .expect(400)
        .end(done);

    });

    it('should clear completedAt when todo is not completed', (done) => {

        var hexId = dummyTodos[1]._id.toHexString();

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', dummyUsers[1].tokens[0].token)
        .send({"completed" : false, "text" : "supertest"})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.completedAt).toNotExist();
            expect(res.body.todo.text).toBe("supertest");
        })
        .end(done);
    });

});

describe ('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', dummyUsers[0].tokens[0].token)   //set is used to set headers
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(dummyUsers[0]._id.toHexString());
            expect(res.body.email).toBe(dummyUsers[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    }); 

});

describe('POST /users', () => {

    it('should created a user', (done) => {
        var email = 'email@example.com';
        var password = '123mnb';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();    //if signup successful, a auth token would be returned
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        //.end(done);
        //check even further
        .end((err) => {
            if(err)
            return done(err);

            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);    //should be a hashed password, instead of a plain text one
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return validation errors if request invalid', (done) => {
        request(app)
        .post('/users')
        .send({email: '123', password: 123})
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use', (done) => {
        request(app)
        .post('/users')
        .send({email: dummyUsers[0].email, password: '123abc'})
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {

        request(app)
        .post('/users/login')
        .send({
            email: dummyUsers[1].email,
            password: dummyUsers[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
        })
        .end((err, res) => {    //we check if the tokens for the test user were updated in the db
            if(err)
            return done(err);

            User.findById(dummyUsers[1]._id).then((user) => {

                expect(user.tokens[1]).toInclude({  //second item, since our seed file has already inserted a single token on tokens[0] for second user
                    access: 'auth',
                    token: res.headers['x-auth']
                });

                done();
            }).catch((e) => done(e));
        });

    });

    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: dummyUsers[1].email,
            password: 'wrong pass'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {    //async end call
            if(err)
            return done(err);

            User.findById(dummyUsers[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1); //our seed file has already inserted a single token on tokens[0] for second user
                done();
            }).catch((e) => done(e));
        });
    });

});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', dummyUsers[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if(err)
            return done(err);

            User.findById(dummyUsers[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((err) => done(err));
        });
    });
});