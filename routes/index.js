var express = require('express');
var router = express.Router();
const mongo = require('mongodb').MongoClient;
const events = require('events');
const em = new events.EventEmitter();

const url = 'mongodb://localhost:27017';

mongo.connect(url, (err, client) => {
  if(err) {
    console.log(err);
    return;
  }
  const db = client.db('manager');
  const collection = db.collection('users');
  em.on('addUser', (user, cb) => {
    collection.insertOne(user, () => {
      cb();
    });
  });
  em.on('getUser', (user, cb) => {
    if(user == "*") {
      collection.find().toArray((err, items) => {
        if(err) {
          console.log(err);
        }
        cb(items);
      });
      return;
    }
    user = JSON.parse(user);
    // TODO: Search for user
  });
  em.on('deleteUser', (id, cb) => {
    collection.deleteOne({id: parseInt(id)}, (err, item) => {
      console.log(err);
      // console.log(item);
      cb();
    });
  });
  em.on('editUser', (id, obj, cb) => {
    collection.updateOne({id: parseInt(id)}, {'$set': obj}, () => {
      cb();
    });
  });
});

/* GET home page. */
router.get('/', (req, res, next) => {
  em.emit('getUser', '*', users => {
    // console.log(users);
    res.render('index', { users: users });
  });
});

router.post('/addUser', (req, res, next) => {
  req.body.id = Math.round(Math.random()*100000);
  em.emit('addUser', req.body, () => {
    res.redirect('/');
  });
});

router.post(/(\/deleteUser)/, (req, res, next) => {
  em.emit('deleteUser', req.url.split('/deleteUser$')[1], err => {
    res.redirect('/');
  });
});

router.post(/(\/editUser)/, (req, res, next) => {
  em.emit('editUser', req.url.split('/editUser$')[1], {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    age: req.body.age
  }, () => {
    res.redirect('/');
  });
});

module.exports = router;
