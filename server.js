const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Psql123',
        database: 'loginformytvideo'
    }
})

const app = express();

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(intialPath, "index.html"));
})

  
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(intialPath, "admin.html"));
})


app.get('/login', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(intialPath, "register.html"));
})

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})

const { Pool } = require('pg');
const pool = new Pool({
	host: '127.0.0.1',
	user: 'postgres',
	password: 'Psql123',
	database: 'loginformytvideo',
  port: 5432,
});



// define the puzzle completed endpoint
app.post('/puzzle-completed', (req, res) => {
  const { timeTaken } = req.body;

  // insert the timeTaken into the database
  pool.query('INSERT INTO puzzle_completed (time_taken) VALUES ($1)', [timeTaken], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error inserting timeTaken into database');
    } else {
      console.log(`Inserted timeTaken into database: ${timeTaken}`);
      res.sendStatus(200);
    }
  });
});


app.post('/store-crossword-data', function(req, res) {
    var crosswordData = req.body;
    

    var query = 'INSERT INTO crossword_data (data) VALUES ($1)';
    var values = [crosswordData];
    pool.query(query, values, function(error, results) {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });
  

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('email or password is incorrect');
        }
    })
})

app.listen(3000, (req, res) => {
    console.log('listening on port 3000......')
})