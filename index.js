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
    res.redirect('http://localhost:3000/chats');
  }
);

app.use(cors({
  "origin": "http://localhost:3000",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "credentials": true,
}));

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});

app.get('/userStatus', function (req, res) {
  console.log('userStatus request received')
  if(!req?.user) {
    console.log('reject, not authorized')
    return res.status(401).send('Not authorized')
  }
  console.log('after status', req.user)
  res.status(200).json({ user: req.user.id})
  // return res.status(200).send()
})

app.get('/', function (req, res) {
  res.send('Hello World!123')
})

// let chat_id = null;
// let user_id = null;

// const user = new User({
//   firstName: 'Ram',
//   lastName: 'Alva',
//   email: 'ramanan.a125@gmail.com',
//   googleId: '123'
// });

// user
//   .save(function(err) {
//     user_id = user._id;

//     const chat = new Chat({6045a32b6dd4acfaf8ee6df8
//       users: new Array(user._id),
//       messages: [],
//     });

//     chat_id = chat._id;
//     chat.save(() => console.log('chat_id created', chat._id))
//   })


io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;
  // add to room keyed by user id
  socket.join(userId);
  console.log('created room for', userId)

  // if(connected.length === 0) {
  //   socket.join(start);
  // } else {
  //   start++;
  //   socket.join(start);
  // }

  // connected.push(start);
  const messages = [];

  socket.on('getConvos', async (user) => {
    console.log('received request for convos', user);
      const chats = await Chat.find( { users: user.user } ).populate('users').exec();
      console.log('sending convos', chats);
      
      socket.emit('convos', chats);
  })

  socket.on('messageHistory', async (value) => {
    console.log('received message history request', value)
    //get the messages from the db
    const chatLoadTest = await Chat.findOne({_id: value.cid});
    console.log('chatLoad test', chatLoadTest);
    let messageHistory;

    if(chatLoadTest.messages.length < 20) {
      messageHistory = chatLoadTest.messages
    } else {
      messageHistory = chatLoadTest.messages.slice(Math.max(chatLoadTest.messages.length - 20, 0))
    }

    socket.emit('messageHistory', { cid: value.cid, history: messageHistory });
    // numOfMessages = chatLoadTest.messages.length > 20 ? 20 : chatLoadTest.messages.length;
  })

  socket.on('message', async (value) => {
    console.log('on message value', value);

    const sender = await User.findOne({_id: value.userId}).exec();
    console.log('sender', sender)
    // create message insert obj
    const messageInsert = {
      value: value.message,
      user: sender._id,
      name: `${sender.firstName} ${sender.lastName}`
    };

    console.log('insert obj', messageInsert);

    const selectedChat = await Chat.findOne({ _id: value.cid }, function(err, chatRes) {
      // console.log('tes', chatRes)
      chatRes.messages.push(messageInsert);
      chatRes.save();
    }).exec();

    const messageResponse = {
      value: value.message,
      user: sender._id,
      name:`${sender.firstName} ${sender.lastName}`,
      cid: value.cid,
      timestamp: new Date()
    };

    console.log('response', messageResponse)
  
    // send the message to all users of the room including the sender
    selectedChat.users.forEach((uid) => {
      io.in(uid.toString()).emit('message', messageResponse);
    })
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