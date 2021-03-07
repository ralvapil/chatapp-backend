require('dotenv').config()
const cors = require('cors');
const http = require("http");
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const User = require('./models/user');
const Chat = require('./models/chat');
const chat = require('./models/chat');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(cookieParser('cats'));
app.use(session({ 
  secret: "cats", 
  cookie: { 
    
    secure: false, 
    maxAge: 24*60*60*1000 
  },
  // name: 'chat-app-demo'
}));
// app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('serialize user', user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    console.log('deserlized user', user)
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: '17046437582-pbhk4jniie6m0p7llcttm3r4770t6tv2.apps.googleusercontent.com',
  clientSecret: 'fnTOqOhBNLB7wvsU5MkfpHj1',
  callbackURL: "http://localhost:5000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  // console.log('accesstoken', accessToken);
  // console.log('refreshToken', refreshToken);
  // console.log('profile', profile);

     User.findOrCreate(profile, function (err, user) {
       return done(err, user);
     });
}
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/userStatus');
  }
);


app.use(cors());

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.get('/userStatus', function (req, res) {
  if(!req?.user) {
    return res.redirect('auth/google');
  }
  console.log('after status', req.user)
  res.send('after status check')
})

app.get('/', function (req, res) {
  res.send('Hello World!123')
})

let chat_id = null;
let user_id = null;

const user = new User({
  firstName: 'Ram',
  lastName: 'Alva',
  email: 'ramanan.a125@gmail.com',
  googleId: '123'
});

user
  .save(function(err) {
    user_id = user._id;

    const chat = new Chat({
      users: new Array(user._id),
      messages: [],
    });

    chat_id = chat._id;
    chat.save(() => console.log('chat_id created', chat._id))
  })

io.on("connection", (socket, userId) => {
  console.log('connected socket');

  // if(connected.length === 0) {
  //   socket.join(start);
  // } else {
  //   start++;
  //   socket.join(start);
  // }

  // connected.push(start);
  const messages = [];

  socket.on('message', (value) => {

    const messageInsert = {
      value: value.message,
      user: user_id,
      name: 'Ramanan Alvapillai'
    };

    const selectedChat = Chat.findOne({ _id: chat_id }, function(err, chatRes) {
      console.log('tes', chatRes)
      chatRes.messages.push(messageInsert);
      chatRes.save();
    });

    const messageResponse = {
      value: value.message,
      user: {
        id: value.userId,
        name: 'Ramanan Alvapillai'
      },
      cid: value.cid,
      timestamp: new Date()
    };

    io.emit('message', messageResponse)

    messages.push(value);

    console.log(messageResponse)
    console.log('message list', messages)
  })
  // ...
});

// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, () => console.log(`Listening on ${ PORT }`));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    httpServer.listen(5000);
  })
  .catch(err => {
    console.error(err)
  });

mongoose.set('useFindAndModify', false);