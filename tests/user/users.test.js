//const express = require('express');
//const app = express();
const app = require('../../server');
const supertest = require('supertest');

const userValues = require('../testConfig');

var token;
var testId;

jest.setTimeout(15000);

describe("=== Users routes ===", function() {

  beforeEach(function(done) {
    setTimeout(done, 9000);
  })


  it("POST /users/register, should success", (done) =>  {
    supertest(app)
    .post("/users/register")
    .set('Content-Type', 'application/json')
    .send(userValues.user)
    .expect(200, done);
    done();
  })

  it("POST /users/register, should fail -> duplicata", (done) =>  {
    supertest(app)
    .post("/users/register")
    .set('Content-Type', 'application/json')
    .send(userValues.user)
    .expect(400, done);
    done();
  })

  
  it("POST /users/register, should fail -> missing field", (done) =>  {
    supertest(app)
    .post("/users/register")
    .set('Content-Type', 'application/json')
    .send(userValues.badUser)
    .expect(400, done);
    done();
  })

  it("POST /users/authenticate, should success", (done) =>  {
    supertest(app)
    .post("/users/authenticate")
    .set('Content-Type', 'application/json')
    .send(userValues.user)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.text).token).toEqual(expect.anything());
      console.log("before parse " + res.text);
      token = JSON.parse(res.text).token;
      testId = JSON.parse(res.text).id;
      console.log('after parse ' + token);
      done();
    })
  })
/*
  it("GET /users/current, should success", (done) =>  {
    console.log('token = ' + token)
    const bite = token
    const test2 = "Authorization";
    supertest(app)
    .get("/users/current")
    //.auth(bite, {type: 'bearer'})
    .set({authorization: "Bearer " + bite})
    //.set({'Content-Type': 'application/json'})
    .send({'bite': 'bite'})
    //.set('Authorization', 'bearer' + token)
    .end((err, res) => {
      console.log("response = " + JSON.stringify(res));
      console.log(JSON.parse(res.text));
      //.expect(200, done);
      done();
    })
  })
*/
  /*it("POST /users/register, should fail -> missing field", (done) =>  {
    supertest(app)
    .delete("/users/" + )
    .set('Content-Type', 'application/json')
    .send(userValues.badUser)
    .expect(400, done);
    supertest(app)
    done();
  })*/


});
/*
describe("=== Users register ===", function() {
  it("POST /users/register", function(done) {
    request(app)
    .post("localhost:4000/users/register")
    .set("Content-Type", "application/json")
    .send({username:"Kirikou", password: "Kirikou"})
    .expect(200, done)
  })
});

describe("=== Users Get All ===", function() {
  it("GET /users/",function(done) {
    request(app)
    .get("localhost:4000/users/")
    .set('Content-Type', 'application/json')
    .expect(200, done)
  })
});

describe("=== Users Get Me ===", function() {
  it("GET /users/current",function(done) {
    request(app)
    .get("localhost:4000/users/current")
    .set('Content-Type', 'application/json')
    .expect(200, done)
  })
});

describe("=== Users Get By Id ===", function() {
  it("GET /users/",function(done) {
    request(app)
    .get("localhost:4000/users/" + testId)
    .set('Content-Type', 'application/json')
    .expect(200, done)
  })
});

describe("=== Users Update Me ===", function() {
  it("GET /users/",function(done) {
    request(app)
    .put("localhost:4000/users/update")
    .set('Content-Type', 'application/json')
    .expect(200, done)
  })
});

describe("=== Users Delete ===", function() {
  it("GET /users/",function(done) {
    request(app)
    .delete("localhost:4000/users/" + testId)
    .set('Content-Type', 'application/json')
    .expect(200, done)
  })
});*/