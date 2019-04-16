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
  const collection_p = db.collection('searchParam');
  collection_p.insertOne({param: 'first_name', id: 1}, () => {});
  em.on('addUser', (user, cb) => {
    collection.insertOne(user, () => {
      cb();
    });
  });
  em.on('getUser', (user, cb) => {
    collection.find().toArray((err, items) => {
      if(err) {
        console.log(err);
      }
      
      if(user === '*') {
        cb(items);
        return;
      }

      let query = user.split('?');
      let regex = new RegExp(`${query[1]}`, 'i');
      let rtn = [];
      switch(query[0]) {
        case 'first_name':
          for(let i in items) {
            if(items[i].first_name.match(regex) !== null) {
              rtn.push(items[i]);
            }
          }
          cb(rtn);
          break;
        case 'last_name':
          for(let i in items) {
            if(items[i].last_name.match(regex) !== null) {
              rtn.push(items[i]);
            }
          }
          cb(rtn);
          break;
        case 'email':
          for(let i in items) {
            if(items[i].email.match(regex).length === 0) {
              rtn.push(items[i]);
            }
          }
          cb(rtn);
          break;
        default:
          console.log('Invalid query');
          cb(rtn);
          break;
      }
    });
  });
  em.on('deleteUser', (id, cb) => {
    collection.deleteOne({id: parseInt(id)}, (err, item) => {
      if(err) console.log(err);
      cb();
    });
  });
  em.on('editUser', (id, obj, cb) => {
    collection.updateOne({id: parseInt(id)}, {'$set': obj}, () => {
      cb();
    });
  });
  em.on('getSearchParam', (cb) => {
    collection_p.find().toArray((err, items) => {
      console.log(items[0].param);
      cb(items[0].param);
    });
  });
  em.on('setSearchParam', (searchParam, cb) => {
    collection_p.updateOne({id: 1}, {'$set': {param: searchParam}}, () => {
      cb();
    });
  });
});

function sortUsers(order) {
  let rtn;
  if(order === 'ascend') {
    
    return rtn;
  }
  
  return rtn;
}

function getSearchParam(cb) {
  
}

/* GET home page. */
router.get('/', (req, res, next) => {
  em.emit('getUser', '*', users => {
    em.emit('getSearchParam' , param => {
      res.render('index', { users: users, search: {status: false, query: '', param: param} });
    });
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

router.post(/(\/searchUsers)/, (req, res, next) => {
  em.emit('getSearchParam', param => {
    em.emit('getUser', param+'?'+req.body.search, results => {
      res.render('index', { users: results, search: {status: true, query: req.body.search, param: param.replace('_',' ')} });
    });
  });
});

router.post(/(\/updateParam)/, (req, res, next) => {
  let searchParam = req.body.searchParam;
  em.emit('setSearchParam', searchParam, () => {
    res.redirect('/');
  })
});

module.exports = router;
