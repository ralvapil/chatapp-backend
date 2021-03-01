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
  res.send('Hello World!')
})

io.on("connection", (socket) => {
  console.log('connected socket');

  const messages = [];

  socket.on('test', (data) => {
    messages.push(data);
    console.log(data)
    io.emit('message', data);

    console.log('message list', messages)
  })
  // ...
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Listening on ${ PORT }`));