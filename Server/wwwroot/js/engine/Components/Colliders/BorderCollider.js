"use strict";

class BorderCollider extends Collider {
    #localEdges = [];
    #currRotEdges = [];
    edges = [];

    #prevPos = new Vector2();
    #prevRotation = 0;

    SetPoints(edges = []) {
        for (const edge of edges) {
            this.#localEdges.push(edge.copy);
            this.#currRotEdges.push([new Vector2(), new Vector2()]);
            this.edges.push([new Vector2(), new Vector2()]);
        }

        this.set = true;
        this.SetEnabled(true);

        this.UpdateRotationOfEdges();
    }

    GetBounds() {
        let min = Vector2.positiveInfinity;
        let max = Vector2.negativeInfinity;

        for (const edge of this.edges) {
            for (const point of edge) {
                if (point.x < min.x) min.x = point.x;
                else max.x = point.x;

                if (point.y < min.y) min.y = point.y;
                else max.y = point.y;
            }
        }

        this.bounds.tl.Set(min);
        this.bounds.size.Set(Vector2.Subtraction(max, min));
    }


    UpdateRotationOfEdges() {
        this.#prevRotation = this.transform.rotation;

        for (const i in this.#currRotEdges) {
            let angle1 = Vector2.SignedAngle(this.#localEdges[i][0], Vector2.right) + this.#prevRotation;
            let angle2 = Vector2.SignedAngle(this.#localEdges[i][1], Vector2.right) + this.#prevRotation;

            this.#currRotEdges[i][0].Set(Math.cos(angle1), Math.sin(angle1));
            this.#currRotEdges[i][1].Set(Math.cos(angle2), Math.sin(angle2));

            this.#currRotEdges[i][0].Scale(this.#localEdges[i][0].magnitude);
            this.#currRotEdges[i][1].Scale(this.#localEdges[i][1].magnitude);
        }

        this.UpdatePositionOfEdges();
    }

    UpdatePositionOfEdges() {
        this.#prevPos.Set(this.transform.position);

        this.centerPoint.Set(this.transform.position);
        this.centerPoint.Add(this.offset);

        for (const i in this.edges) {
            this.edges[i][0].Set(this.#currRotEdges[i][0]);
            this.edges[i][1].Set(this.#currRotEdges[i][1]);

            this.edges[i][0].Add(this.centerPoint);
            this.edges[i][1].Add(this.centerPoint);
        }

        this.GetBounds();
    }

    Update() {
        if (!this.set) return;

        if (this.#prevRotation !== this.transform.rotation) this.UpdateRotationOfPoints();
        if (!this.#prevPos.Equals(this.transform.position)) this.UpdatePositionOfEdges();
    }

    Draw() {
        super.Draw();

        context.beginPath();

        for (const edge of this.edges) {
            context.moveTo(edge[0].x, edge[0].y);
            context.lineTo(edge[1].x, edge[1].y);
        }

        context.strokeStyle = "#3f3";
        context.lineWidth = 3;
        context.stroke();
    }
}