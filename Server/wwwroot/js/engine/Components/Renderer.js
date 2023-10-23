"use strict";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

class Renderer extends Component {
    color;
    imageId;

    offsetX = 0;
    size;

    LateUpdate() {
        const centerPos = this.transform.centerPos;

        context.save();

        context.translate(this.transform.position.x, this.transform.position.y);
        context.rotate(this.transform.rotation);
        context.translate(-this.transform.position.x, -this.transform.position.y);

        if (typeof this.imageId !== "undefined") {
            const image = document.getElementById(this.imageId);

            if (typeof image === "undefined") console.warn(`Image with '${this.imageId}' id not found`);
            else context.drawImage(image, this.offsetX, 0, this.size.x, this.size.y, centerPos.x, centerPos.y, this.transform.scale.x, this.transform.scale.y);
        } else {
            context.fillStyle = this.color ?? "black";
            context.fillRect(centerPos.x, centerPos.y, this.transform.scale.x, this.transform.scale.y);
        }

        context.restore();
    }
}
