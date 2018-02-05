import Phaser from 'phaser'


export default class Building {
  constructor(game, x, y, option) {

    this.game = game

    // this.sprite = this.game.add.sprite(0, 0, 'building', 100);
    this.sprite = this.game.add.sprite(0, 0, option, 100);
    this.sprite.game.physics.arcade.enableBody(this.sprite);
    this.sprite.body.immovable = true;
    this.sprite.anchor.setTo(0.5, 0.5)
    // this.sprite.scale.setTo(0.75, 0.75)
    this.sprite.scale.setTo(0.28)
    this.sprite.x = x
    this.sprite.y = y

  }
}