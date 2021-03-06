const config = require('./config');
module.exports = new(class Zombies {
	constructor() {
		this.zombies = [];
		this.killCount = 0;
	}
	add(id,playerId,boss) {
		const {
			posX,
			posY
		} = zombieLocation();
		const newZombie = {
			id,
			posX,
			posY,
			playerId,
			boss
		};
		this.zombies.push(newZombie);
		return newZombie;
	}
	get(id) {
		for (let i = 0; i < this.zombies.length; i++)
			if (this.zombies[i].id == id) return this.zombies[i];
		return this.zombies;
	}
	set(id, json) {
		this.zombies = this.zombies.map((e) => {
			if (e.id == id) {
				Object.keys(json).forEach((k) => {
					e[k] = json[k];
				});
			}
			return e;
		});
	}
	getKillCount() {
		return this.killCount;
	}
	setKillCount() {
		this.killCount++;
	}
	getLength() {
		return this.zombies.length;
	}
	delete(id) {
		for (let i = 0; i < this.zombies.length; i++)
			if (this.zombies[i].id == id) this.zombies.splice(i, 1);
	}
});

function zombieLocation() {
	let randomSpawn = Math.ceil(Math.random() * 10)
	if (randomSpawn <= 4) {
		return {
			posX: 625 + Math.ceil(Math.random() * 100),
			posY: 116 + Math.ceil(Math.random() * 100)
		}
	} else if (randomSpawn <= 7) {
		return {
			posX: 1806 - Math.ceil(Math.random() * 100),
			posY: 1048 + Math.ceil(Math.random() * 100)
		}
	} else {
		return {
			posX: 624 + Math.ceil(Math.random() * 100),
			posY: 1821 - Math.ceil(Math.random() * 100)
		}
	}
}