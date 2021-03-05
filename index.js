const cors = require('cors');
const http = require("http");
const express = require('express');
const app = express();
app.use(cors());

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.get('/', function (req, res) {
  res.send('Hello World!123')
})

let connected = [];
let start = 2;

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

    const messageResponse = {
      message: value.message,
      user: {
        id: value.userId,
        name: 'Ramanan Alvapillai'
      },
      cid: value.cid,
      timestamp: '12:30pm'
    };

    io.emit('message', messageResponse)

    messages.push(value);

    console.log(messageResponse)
    console.log('message list', messages)
  })
  // ...
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Listening on ${ PORT }`));