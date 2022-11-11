// const express = require('express');
// const cors = require('cors');

// const app = express();

// app.use(express.json());

// app.use(cors());

// exports.SigninRoute =  (req, res) => {
//     const {email,password} = req.body
//     db.select('email', 'hash')
//     .from('login')
//     .where("email", "=",email)
//     .then(data => {
//         const isValid = bcrypt.compareSync(password, data[0].hash);
//         if (isValid) {
//            return db.select('*')
//             .from("users")
//             .where("email", "=",email)
//             .then((users)  => {
//                 res.json(users[0]);
//             })
//             .catch((err) => res.status(400).json("unable to get user"))
//         } else{
//            res.status(400).json("1wrong credentials");
//         }
//     })
//      .catch((err) => res.status(400).json("unable to get user"));
// };


// ///register Route

// exports.RegisterRoute =  (req,res) => {
//     const {name, email, password} = req.body;
//     const hash = bcrypt.hashSync(password);
 
//     db.transaction(trx => {
//      trx.insert({
//          hash: hash,
//          email:email,
//      })
//      .into('login') 
//      .returning('email')
//      .then(loginEmail => {
     
 
//       return trx('users')
//      .returning('*')
//      .insert({
//      email:loginEmail[0].email,
//      name:name,
//      joined: new Date()
//   })
//    .then((users) => {
//      res.json(users[0]);
//   }) 
//      })
//  .then(trx.commit)
//  .catch(trx.rollback);
//     }).catch(err => res.status(400).json("unable to register"));
// } 


// ///profile route  

// exports.ProfileRoutes = (req,res) => {
//   const {id} = req.params;
//   //let found = false;

//   db.select('*')
//   .from("users")
//   .where({
//     id:id,
//   })
//   .then((users) => {
//    // console.log(user[0]);
//    // res.json(users[0]);
//  if (users.length){
//     res.json(users[0]);
//  } else{
//     res.status(400).json ("no user found")
//  }


//  })
//  .catch((err) => res.status(400).json("NOT FOUND"))

// //   database.users.forEach(user => {
// //     if(user.id === id){
// //         found = true;
// //         return res.json(user);
// //     }
//  // });

// //  if (!found) {
// //     res.status(404).json("user not found");
// //   }
// }

// ///link routes

// exports.LinkRoutes = (req,res) => {
//     const {id} = req.body;
//    // let found = false;
//   db('users').where('id', '=', id) .increment("entries", 1)
//   .returning('entries')
//   .then((entries) => 
//     res.json(entries[0]))
//     .catch((err) => res.status(400).json ("cannot get entries"));
// //     database.users.forEach(user => {
// //       if(user.id === id){
// //           found = true;
// //           user.entries++;
// //           return res.json(user.entries);
// //       }
// //     });
// //    if (!found) {
// //       res.status(404).json("user not found");
// //     }
// }