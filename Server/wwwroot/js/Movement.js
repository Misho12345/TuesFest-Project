"use strict";

class Movement extends Component {
    #velocity = Vector2.zero;
    speed = 3;

    Awake() {
        let input = this.gameObject.AddComponent(Input);

        input.AddAction("KeyW", undefined, _ => this.#velocity.y = -1, _ => this.#velocity.y = 0);
        input.AddAction("KeyA", undefined, _ => this.#velocity.x = -1, _ => this.#velocity.x = 0);
        input.AddAction("KeyS", undefined, _ => this.#velocity.y =  1, _ => this.#velocity.y = 0);
        input.AddAction("KeyD", undefined, _ => this.#velocity.x =  1, _ => this.#velocity.x = 0);
    }

    Update() {
        if (this.#velocity.Equals(Vector2.zero)) return;

        this.#velocity.Normalize();
        this.#velocity.Scale(this.speed);

        this.transform.position.Add(this.#velocity);

        connection.invoke("MovePlayer", this.#velocity.x, this.#velocity.y)
            .catch((error) => console.error(error));

        //for (const gObj of GameObject.gameObjects)
        //    if (gObj !== this.gameObject && gObj.trigger === true)
        //        this.transform.position.Add(DetectCollision(this.gameObject, gObj));
    }
}
