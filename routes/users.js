const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const config = require('../config/database');
const middleware = require('./errorHandler');
// const User = require('../models/user');
const connection = (closure) => {
  return MongoClient.connect(config.database, (err, client) => {
    if (err) return console.log(err);
    const db = client.db(config.secret);
    closure(db); 
  });
};
// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};
// Response handling
let response = {
  status: 200,
  success:true,
  data: [],
  message: null
};
// Register
router.post('/register', (req, res, next) => {
  let newUser = {
    name: req.body.uid,
    email: req.body.email,
    username: req.body.email
  };
  console.log('req.body');
    connection((db) => {
      try{
        db.collection('users').insert(newUser, function (err, records) {          
          if (err) {          
            next(err);
          } else {
            console.log(records);
            response.message = `User registered with ID ${records.insertedIds[0]} in system`;
            response.data.push(records.insertedIds);
            res.json(response);
          }
        });
      }catch(err){
        next(err);
      }
      
    });
});
router.delete('/remove/:email', (req, res, next) => {
  connection((db) => {
    db.collection('users').deleteMany({ email: req.params.email }, (err, result) => {
      if (err) {
        return res.status(404).json({ err: err });
      } else {
        console.log(result);
      }
    });
  });
});
// Authenticate
// router.post('/authenticate', (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   User.getUserByUsername(username, (err, user) => {
//     if(err) throw err;
//     if(!user) {
//       return res.json({success: false, msg: 'User not found'});
//     }

//     User.comparePassword(password, user.password, (err, isMatch) => {
//       if(err) throw err;
//       if(isMatch) {
//         const token = jwt.sign({data: user}, config.secret, {
//           expiresIn: 604800 // 1 week
//         });
//         res.json({
//           success: true,
//           token: 'JWT '+token,
//           user: {
//             id: user._id,
//             name: user.name,
//             username: user.username,
//             email: user.email
//           }
//         })
//       } else {
//         return res.json({success: false, msg: 'Wrong password'});
//       }
//     });
//   });
// });

// Profile
// router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
//   res.json({user: req.user});
// });
// Get users
router.get('/getAll', (req, res) => {
  connection((db) => {
    db.collection('users')
      .find()
      .toArray()
      .then((users) => {
        response.data = users;
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});
router.get('/topCustomers', (req, res) => {
  connection((db) => {
    // const id = req.query.id;
    // const saleAmount = req.query.SaleAmount;
    // console.log(id);
    // console.log(saleAmount);
    console.log(req.route);

    const collection = db.collection('users');
    collection.aggregate()
      //.match(qb.where("status").eq("A"))
      //.project("gender _id")
      //.unwind("$arrayField")
      .group({ _id: req.query.id, SaleAmount: { $sum: req.query.SaleAmount } })
      .sort({ 'SaleAmount': -1 })
      .toArray()
      .then((users) => {
        response.data = users;
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});

router.use(middleware.logErrors);
router.use(middleware.errorHandle);

module.exports = router;
