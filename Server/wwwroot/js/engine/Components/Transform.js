"use strict";

class Transform extends Component {
    position;
    scale;
    rotation;

    parent;
    name;

    get centerPos() { return Vector2.Sum(this.position, Vector2.Scale(this.scale, -0.5)) }
}
