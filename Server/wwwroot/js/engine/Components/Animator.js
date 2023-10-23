"use strict";

class Animator extends Component {
    renderer;

    #cooldown;
    #frameIdx;

    #framesCount;
    #framesDelay;
    #frameWidth;

    stages = [];

    Awake() {
        this.renderer = this.gameObject.GetComponent(Renderer);

        if (this.renderer === undefined) {
            console.warn("Renderer component required for animation");
            return;
        }

        this.Play(0);
    }

    Update() {
        if (this.renderer === undefined) return;

        if (this.#cooldown >= 0) {
            this.#cooldown -= deltaTime;
            return;
        }

        this.#cooldown = this.#framesDelay;
        this.#frameIdx++;

        if (this.#frameIdx >= this.#framesCount)
            this.#frameIdx = 0;

        this.renderer.offsetX = this.#frameWidth * this.#frameIdx + 1;
    }

    Play(stage) {
        let image = document.getElementById(this.stages[stage].frames);
        this.#framesCount = this.stages[stage].length;
        this.#framesDelay = this.stages[stage].delay;
        this.#frameWidth = (image.naturalWidth - 1) / this.#framesCount;

        this.#cooldown = -1;
        this.#frameIdx = -1;

        this.renderer.imageId = this.stages[stage].frames;
        this.renderer.size = new Vector2(this.#frameWidth, image.naturalHeight);
    }
}
