const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('../users/usersRouter.js');
const authRouter = require('../auth/auth-router.js');

const server = express();

const sessionConfig = {
    name: 'monster',
    secret: 'Keep it trill, keep it safe. -self',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 2,
        secure: false,
    },
   store: new KnexSessionStore({
       knex: require('../database/dbConfig.js'),
       tablename: 'sessions',
       sidfieldname: 'sid',
       createtable: true,
       clearInterval: 1000 * 60 * 60,
   }),
}

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
    const username = req.session.username || 'stranger';
    res.send(`Hello ${username}!`);
})

module.exports = server;
