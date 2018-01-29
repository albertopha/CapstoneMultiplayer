const config = require('./config');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use('/',express.static(config.publicDir));
//-socket
const players = require('./players.js');
// const zombies = require('./zombies.js'); //not sure if I'm using it

io.on('connection', socket => {
	players.add(socket.id); console.log(`${socket.id} added`);
	io.emit('server:player-added',players.get(socket.id));

	socket.on('client:give-me-players', ()=>{
		socket.emit('server:all-players', players.get());
	});

	socket.on('client:player-moved',data=>{
		socket.broadcast.emit('server:player-moved', players.get(socket.id));
		players.set(data.id, {posX: data.posX, posY: data.posY});
	});

	socket.on('disconnect', ()=>{
		players.delete(socket.id);
		io.emit('server:player-disconnected',socket.id); console.log(`${socket.id} disconnected`);
	});

	socket.on('client:create-zombies', data => {
		console.log('server broadcast zombie');
		socket.broadcast.emit('server:create-zombies', data);
	});
});
//=socket
server.listen(config.port, ()=>{
	console.log(`Listening on ${config.port}`);
});
