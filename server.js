// import express
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
let knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'MikeHenze',
    password : '',
    database : 'smart-brain'
  }
});

db.select('*').from('users').then(data => {
  // console.log(data);
});


// create app
const app = express();

// Cross-origin resource sharing
app.use(cors());

// body parser for json data being sent from the front end
app.use(bodyParser.json());


// creating get route to main directory
app.get('/', (req, res) => {
  res.send(database.users);
});

// signin
app.post('/signin', (req, res) => {
 db.select('email', 'hash').from('login')
 .where('email', '=', req.body.email)
 .then(data => {
  const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
  if (isValid) {
    return db.select('*').from('users').where('email', '=', req.body.email).then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to get user'));
  } else {
    res.status(400).json('wrong credentials');
  }
 })
 .catch(err => res.status(400).json('wrong credentials'));
});

// register
app.post('/register', (req, res) => {
  const {email, name, password} = req.body;

  const hash = bcrypt.hashSync(password);

  // bcrypt.compareSync("bacon", hash); // true
  // bcrypt.compareSync("veggies", hash); // false

  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
      .returning('*')
      .insert({
        email: loginEmail[0],
        name: name,
        joined: new Date()
      })
      .then(user => {
        res.json(user[0]);
      });
      })
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch(err => res.status(400).json('unable to register'));
});

// profile page
app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  db.select('*').from('users').where({id}).then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('not found');
    }
  })
  .catch(err => res.status(400).json('error getting user'));
  // if user is not found respond with a 400 not found
  // if (!found) {
  //   res.status(400).json('not found');
  // }
});

// update users entry count with image submit
app.put('/image', (req, res) => {
  const {id} = req.body;

  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err=> res.status(400).json('unable to get entries'));
});

// create port
app.listen(3000, () => {
  console.log('app is running correctly on port 3000');
});