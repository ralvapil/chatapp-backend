require('dotenv').config()
const cors = require('cors');
const http = require("http");
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const passport = require('passport')
const ContactList = require('./models/contactList')

const authRoutes = require('./routes/authRoutes');
const getSocketRoutes = require('./routes/socketRoutes');
const setupPassport = require('./setupPassport');

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

app.use(function(req, res, next) {
  // attach io instance to res obj incase we need it
  res.io = io;
  next();
})

app.use('/auth', authRoutes);
setupPassport();


// const test = ContactList.findOne({user: mongoose.Types.ObjectId('6057c7a2687b02e16033eb50')}).populate({contacts.})
  // test.contacts.push( mongoose.Types.ObjectId('6057c7ec687b02e16033eb51'));
  // test.save();
// passport.serializeUser(function(user, done) {
//   console.log('serialize user', user);
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   const user = UserService.getUser(id);
//   done(null, user);
// });

// passport.use(new GoogleStrategy({
//   clientID: '17046437582-pbhk4jniie6m0p7llcttm3r4770t6tv2.apps.googleusercontent.com',
//   clientSecret: 'fnTOqOhBNLB7wvsU5MkfpHj1',
//   callbackURL: "http://localhost:5000/auth/google/callback"
// },
// function(accessToken, refreshToken, profile, done) {
//     UserService.findByGoogleIdOrCreate(profile);
//     return done(err, user);
//     //  User.findOrCreate(profile, function (err, user) {
//     //    return done(err, user);
//     //  });
// }
// ));

// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('http://localhost:3000/chats');
//   }
// );



// app.get('/userStatus', function (req, res) {
//   console.log('userStatus request received')
//   if(!req?.user) {
//     console.log('reject, not authorized')
//     return res.status(401).send('Not authorized')
//   }
//   console.log('after status', req.user)
//   res.status(200).json({ user: req.user.id})
//   // return res.status(200).send()
// })

// app.get('/', async function (req, res) {
//   // res.send('Hello World!123')

//   const results = await Chat
//   .find( { users: '60457f15aa458bd0890f2641' } )
//   .populate({
//     path: ''
//   })
//   .exec();

//   res.send(results)
//   //populate contact data
//   // const contactList = new ContactList({
//   //   user: '60457f15aa458bd0890f2641',
//   //   contacts: [
//   //     {
//   //       user: '6045a32b6dd4acfaf8ee6df8',
//   //       nickname: 'ram-judo'
//   //     }
//   //   ],
//   // })

//   // contactList.save(() => console.log('contact list created: ', contactList))
// })

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;
  // add to room keyed by user id
  socket.join(userId);
  console.log('created room for', userId)

  getSocketRoutes(socket, io);

  // socket.on('getConvos', async (user, callback) => {
  //   console.log('received request for convos', user);

  //   // const chats = await 
  //   // Chat
  //   //   .aggregate([
  //   //     { $match: { user: mongoose.Types.ObjectId(user.user) } },
  //   //     { $lookup: 
  //   //       { 
  //   //         from: 'users',
  //   //         localField: 'user',
  //   //         foreignField: '_id',
  //   //         as: 'usersData'
  //   //       }
  //   //     }
  //   //   ])
  //   //   .exec();

  //     // const chats = await 
  //     // Chat
  //     //   .find( { users: user.user } )
  //     //   .populate('users')
  //     //   .exec();

  //   const chats = await 
  //   Chat
  //     .find({ "users.user": mongoose.Types.ObjectId(user.user) })
  //     .exec();

  //     console.log('sending convos', chats);
  //     callback(chats)
  //     // socket.emit('convos', chats);
  // })

  // socket.on('messageHistory', async (value, callback) => {
  //   console.log('received message history request', value)
  //   //get the messages from the db
  //   const chatLoadTest = await Chat.findOne({ _id: value.cid });
  //   const chats = await 
  //   Chat
  //     .findOne({ _id: value.cid })
  //     .exec();

  //     console.log('sending convos', chats);
  //     callback(chats)
  //   console.log('chatLoad test', chatLoadTest);
  //   let messageHistory;

  //   callback({ chat: chats });
  //   // numOfMessages = chatLoadTest.messages.length > 20 ? 20 : chatLoadTest.messages.length;
  // })

  // socket.on('message', async (value) => {
  //   console.log('on message value', value);

  //   const sender = await User.findOne({_id: value.userId}).exec();

  //   // create message insert obj
  //   const messageData = {
  //     chat: value.cid,
  //     value: value.message,
  //     user: sender._id,
  //     senderName: `${sender.firstName} ${sender.lastName}`
  //   };

  //   const { message, selectedChat } = await insertMessage(messageData);
  //   const userIdx = selectedChat.users.findIndex((user) => user.user.toString() === value.userId);
  //   const response = {
  //     user: {
  //       _id: selectedChat.users[userIdx].user,
  //       unreadMsgCount: selectedChat.users[userIdx].unreadMsgCount,
  //     },
  //     message 
  //   }

  //   // send the message to all users of the room including the sender
  //   selectedChat.users.forEach((user) => {
  //     io.in(user.user.toString()).emit('message', response);
  //   })
  // })

  // socket.on('readMessage', async (value) => {
  //   console.log('read message request', value)

  //   // get number of messages after message id sent
  //   const unReadMsgCount = await Message.aggregate([
  //     { $match: 
  //       { chat: { $eq: value.cid },
  //         _id: { $gt: mongoose.Types.ObjectId(value.lastMessage_id) }
  //       }, 
  //     },
  //     { $count: "count"}
  //   ])

  //   const newUnReadMsgCount = unReadMsgCount.length > 0 ? unReadMsgCount.count : 0;

  //   const chat = await Chat.findOne( {_id: value.cid } );
  //   console.log('aggregate results', newUnReadMsgCount)

  //   userIdx = chat.users.findIndex((user) => {

  //     return user.user.toString() === value.userId
  //   });
  //   console.log('idx', userIdx);
  //   chat.users[userIdx].lastReadMsg = mongoose.Types.ObjectId(value.lastMessage_id);
  //   chat.users[userIdx].unreadMsgCount = newUnReadMsgCount

  //   // update the unread count and the last read message for the user
  //   console.log('chat as update is occuring', chat.users);
  //   chat.save();
  //   console.log('save done');
  // })
});

// const insertMessage = async (messageData) => {
//     console.log('message data', messageData)

//     const message = new Message(messageData);
//     await message.save();
  
//     const selectedChat = await Chat.findOne({ _id: messageData.chat }, function(err, res) {
//       if(res.recentMsgs.length > 20) {
//         res.recentMsgs.shift();
//       }
//       res.recentMsgs.push(message);
//       res.save();
//     });

//     return { message, selectedChat };
// }
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