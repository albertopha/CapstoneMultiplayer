const config = require('./config');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use('/', express.static(config.publicDir));
//-socket
const players = require('./players.js');
const missiles = require('./missiles.js');
const zombies = require('./zombies.js');

io.on('connection', socket => {
	players.add(socket.id);
	io.emit('server:player-added', players.get(socket.id));

	socket.on('client:give-me-players', () => {
		socket.emit('server:all-players', players.get());
	});

	socket.on('client:player-moved', data => {
		socket.broadcast.emit('server:player-moved', players.get(socket.id));
		players.set(data.id, {
			posX: data.posX,
			posY: data.posY
		});
	});

	// data is id: z.id, posX: z.sprite.x, posY: z.sprite.y
	socket.on('client:zombie-moved', data => {
		socket.broadcast.emit('server:zombie-moved', zombies.get(data.id));
		zombies.set(data.id, {
			posX: data.posX,
			posY: data.posY
		});
	});

	socket.on('disconnect', () => {
		players.delete(socket.id);
		io.emit('server:player-disconnected', socket.id);
	});

	socket.on('client:missile-fired', (data) => { // Data here is the missileGroup to be passed to other clients

		socket.broadcast.emit('server:missile-moved', missiles.get(socket.id));
		missiles.set(data.id, {
			posX: data.posX,
			posY: data.posY,
			velocityX: data.velocityX,
			velocityY: data.velocityY,
			itemName: data.itemName
		})
	});
	socket.on('client:give-me-zombies', () => {
		let allZombies = zombies.get();
		socket.emit('server:all-zombies', allZombies);
	})

	socket.on('client:ask-to-create-zombie', () => {
		if (zombies.getLength() < 2) {
			let newZombie = zombies.add(newZombieId());
			io.emit('server:zombie-added', newZombie);
		}
		return;
	})

	socket.on('client:ask-to-create-missile', (data) => {
		let newMissile = missiles.add(data.id, data.posX, data.posY, data.itemName);
		io.emit('server:missile-added', newMissile);
	});

	socket.on('client:kill-this-zombie', id => {
		zombies.delete(id);
		io.emit('server:kill-this-zombie', id);
	})

});
//=socket
server.listen(config.port, () => {
	console.log(`Listening on ${config.port}`);
});

//creating new zombie id
function newZombieId() {
	let id = new Date();
	return id.getTime();
}