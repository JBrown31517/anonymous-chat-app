const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

function getRandomItem(rooms) {
  for (const room of rooms) {
    if (room.size >= 3) {
      rooms.delete(room);
    }
  }
  let items = Array.from(rooms);
  return items[Math.floor(Math.random() * items.length)];
}

io.on('connection', socket => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('find_rooms', () => {
    let randomRoom;
    let id;
    const rooms = io.sockets.adapter.rooms;
    const getRoom = () => {
      for (const room of rooms) {
        if (room[1].size === 2) {
          console.log('joining exisitng room');
          id = room;
        }
      }
      if (id === undefined) {
        console.log('getting random room');
        randomRoom = getRandomItem(rooms);
        id = randomRoom;
      }
      return id;
    };

    let roomId = getRoom();

    if (typeof roomId === 'object') {
      roomId = [...roomId][0];
    }
    console.log(io.sockets.adapter.rooms);
    socket.join(roomId);
    console.log(io.sockets.adapter.rooms);

    const roomInfo = {
      roomId,
      userId: socket.id,
      size: io.sockets.adapter.rooms.get(roomId).size - 1,
    };

    socket.emit('room_info', roomInfo);
  });

  socket.on('send_message', data => {
    console.log(data);
    socket.broadcast.to(data.roomId).emit('receive_message', data.value);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
