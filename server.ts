const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

io.on('connection', client => {
    console.log('Connected')
    client.on('event', data => {
        console.log(data)
    });
    client.on('disconnect', () => {
        console.log('Disconnected')
    });

    client.on('update', (message)=>{
        console.log(message.p);
    })
});

server.listen(3000);