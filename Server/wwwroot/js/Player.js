"use strict";

let player;

class Player extends GameObject {
    static players = [];
    playerIdx;

    constructor(name, position = Vector2.zero, scale = new Vector2(100), rotation = 0, parent) {
        super(name, position, scale, rotation, parent);
        this.playerIdx = Player.players.length;
        Player.players.push(this);

        let renderer = this.AddComponent(Renderer);
        renderer.color = `rgb(\
            ${Math.floor(Math.random() * 256)}, \
            ${Math.floor(Math.random() * 256)}, \
            ${Math.floor(Math.random() * 256)})`;
    }

    static FindPlayerByName(name) {
        for (const player of Player.players) {
            if (player.transform.name === name) {
                return player;
            }
        }

        return undefined;
    }

    Destroy() {
        Player.players.splice(this.playerIdx);
        for (let i = this.idx; i < Player.players.length; i++) {
            Player.players[i].playerIdx = i;
        }

        super.Destroy();
    }
}