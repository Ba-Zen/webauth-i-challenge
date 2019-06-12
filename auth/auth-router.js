const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 8)

    user.password = hash;

    Users.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(err => {
        res.status(500).json(err);
    });
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.username = user.username;
            res.status(200).json({ message: `Welcome ${user.username}, have a cookie!` });
        } else {
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

router.get('/logout', (req,res) => {
    if (req.session) {
      req.session.destroy(err => {
        if(err) {
          res.send('you cain checkout but chu caint neva leave')
        } else {
          res.send('adios')
        }
      })
    } else {
      res.send('already logged out');
    }
  })

module.exports = router;


