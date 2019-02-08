// import express
const express = require('express');
const bodyParser = require('body-parser');



// create app
const app = express();

// body parser for json data being sent from the front end
app.use(bodyParser.json());

// dummy data in place of database
const database = {
  users: [
    {
      id: '1',
      name: 'Mike',
      email: 'mike@gmail.com',
      password: 'password',
      // dispalys count of pictures used for face recognition
      entries: 0,
      // using new Date() to dispaly when user joined
      joined: new Date()

    },
    {
      id: '2',
      name: 'jack',
      email: 'jack@gmail.com',
      password: 'password',
      // dispalys count of pictures used for face recognition
      entries: 0,
      // using new Date() to dispaly when user joined
      joined: new Date()

    }
  ]
};


// creating get route to main directory
app.get('/', (req, res) => {
  res.send(database.users);
});

// signin
app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    // using res.json will create a json string to send to the front end
    res.json('success');
  } else {
    // error handling 
    res.status(400).json('error loggin in');
  }
});

// register
app.post('/register', (req, res) => {
  const {email, name, password} = req.body;
  database.users.push({
    id: '3',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  // grabs last object in array
  res.json(database.users[database.users.length - 1]);

});

// profile page
app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  let found = false;
  // looping through users in database checking if user.id matches the id sent back
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    } 
  });
  // if user is not found respond with a 400 not found
  if (!found) {
    res.status(400).json('not found');
  }
});

// update users entry count with image submit
app.post('/image', (req, res) => {
  const {id} = req.body;
  let found = false;
  // looping through users in database checking if user.id matches the id sent back
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      // increase users entries
      user.entries++;
      return res.json(user.entries);
    } 
  });
  // if user is not found respond with a 400 not found
  if (!found) {
    res.status(400).json('not found');
  }
});

// create port
app.listen(3000, () => {
  console.log('app is running correctly on port 3000');
});