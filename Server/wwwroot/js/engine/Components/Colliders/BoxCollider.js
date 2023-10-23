"use strict";

class BoxCollider extends PolygonCollider {
    scale = Vector2.one;

    Awake() {
        const endScale = Vector2.Scale(this.transform.scale, this.scale);

        this.SetPoints([
            new Vector2(endScale.x / -2, endScale.y / -2),
            new Vector2(endScale.x /  2, endScale.y / -2),
            new Vector2(endScale.x /  2, endScale.y /  2),
            new Vector2(endScale.x / -2, endScale.y /  2)
        ], true);
    }
}