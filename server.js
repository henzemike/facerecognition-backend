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

// create port
app.listen(3000, () => {
  console.log('app is running correctly on port 3000');
});



/*
route route
/ => res => GET = this is working

signin route
/signin => POST = success or fail

register route
/register => POST = new user 

profile route
/profile/:userId => GET = return user

rank route
/image => PUT = updated user object
*/