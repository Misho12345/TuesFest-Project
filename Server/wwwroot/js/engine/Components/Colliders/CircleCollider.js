"use strict";

class CircleCollider extends Collider {
    radius;
    #prevPos = new Vector2();

    Awake() {
        if (!this.set) this.SetRadius();
        this.GetBounds()
    }

    Update() {
        if (!this.#prevPos.Equals(this.transform.position)) {
            this.GetBounds();
        }
    }

    SetRadius(radius = this.transform.scale.x / 2) {
        this.radius = radius;
        this.set = true;
        this.SetEnabled(true);
    }

    GetBounds() {
        this.#prevPos.Set(this.transform.position);

        this.centerPoint.Set(this.transform.position);
        this.centerPoint.Add(this.offset);

        this.bounds.tl.Set(this.centerPoint);
        this.bounds.tl.Subtract(this.radius);

        this.bounds.size.Set(this.radius * 2);
    }

    Draw() {
        context.strokeStyle = "#3f3";
        context.lineWidth = 2;

        context.fillStyle = "#5f55";

        context.beginPath();
        context.arc(this.centerPoint.x, this.centerPoint.y, this.radius, 0, 2 * Math.PI);

        context.fill();
        context.stroke();
    }
}