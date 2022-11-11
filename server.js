const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();
const { response } = require('express');
const { hash } = require('bcrypt-nodejs');
// const { SigninRoute, RegisterRoute, ProfileRoutes, LinkRoutes } = require('./Routes');

const db = knex({
    client: 'pg',
    connection: {
      host : process.env.DATABASE_HOST,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PASSWORD,
      database : process.env.DATABASE_NAME,
    }
  });
  
  db.select('*').from ('users').then(console.log)

const app = express();

app.use(express.json());

app.use(cors());


const database = {
    users: [
        {
            id: '12',
            name: 'nmesoma',
            email: 'rock@gmail.com',
            password:'garri',
            entries: '0',
            joined: new Date(),
        },
        {
            id: '13',
            name: 'kachi',
            email: 'bock@gmail.com',
            password:'fire',
            entries: '0',
            joined: new Date(),
        },
    ],
    login: [
        {
          id: "18",
          hash: "",
          email: "micheal@gmail.com",
        },
      ],
 };

//root route
app.get('/', (req,res) =>{
    res.send('index', {title : 'Task-Todo-List'})
});


//signing route
app.post('/signin', (req, res) => {
  const {email,password} = req.body
  db.select('email', 'hash')
  .from('login')
  .where("email", "=",email)
  .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
         return db.select('*')
          .from("users")
          .where("email", "=",email)
          .then((users)  => {
              res.json(users[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"))
      } else{
         res.status(400).json("1wrong credentials");
      }
  })
   .catch((err) => res.status(400).json("unable to get user"));
});

//register route
app.post('/register', (req,res) => {
  const {name, email, password} = req.body;
  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
   trx.insert({
       hash: hash,
       email:email,
   })
   .into('login') 
   .returning('email')
   .then(loginEmail => {
   

    return trx('users')
   .returning('*')
   .insert({
   email:loginEmail[0].email,
   name:name,
   joined: new Date()
})
 .then((users) => {
   res.json(users[0]);
}) 
   })
.then(trx.commit)
.catch(trx.rollback);
  }).catch(err => res.status(400).json("unable to register"));
});


//profile route
app.get('/profile/:id', (req,res) => {
  const {id} = req.params;
  //let found = false;

  db.select('*')
  .from("users")
  .where({
    id:id,
  })
  .then((users) => {
   // console.log(user[0]);
   // res.json(users[0]);
 if (users.length){
    res.json(users[0]);
 } else{
    res.status(400).json ("no user found")
 }


 })
 .catch((err) => res.status(400).json("NOT FOUND"))

//   database.users.forEach(user => {
//     if(user.id === id){
//         found = true;
//         return res.json(user);
//     }
 // });

//  if (!found) {
//     res.status(404).json("user not found");
//   }
});



//link route
app.put('/link', (req,res) => {
  const {id} = req.body;
 // let found = false;
db('users').where('id', '=', id) .increment("entries", 1)
.returning('entries')
.then((entries) => 
  res.json(entries[0]))
  .catch((err) => res.status(400).json ("cannot get entries"));
//     database.users.forEach(user => {
//       if(user.id === id){
//           found = true;
//           user.entries++;
//           return res.json(user.entries);
//       }
//     });
//    if (!found) {
//       res.status(404).json("user not found");
//     }
});
  



app.listen(3004, () => {
    console.log('the api is running on port 3004')
});