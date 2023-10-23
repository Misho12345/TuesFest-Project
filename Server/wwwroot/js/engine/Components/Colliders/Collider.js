"use strict";

class Collider extends Component {
    draw = false;
    set = false;
    trigger = false;

    offset = new Vector2();
    centerPoint = new Vector2();

    bounds = {
        tl: new Vector2(),
        size: new Vector2()
    };

    constructor() {
        super();
        this.SetEnabled(false);
    }

    Draw() { }
    GetBounds() { }

    LateUpdate() {
        if (!this.draw || !this.set) return;
        this.Draw();

        context.strokeStyle = "#aba";
        context.lineWidth = 1;

        context.strokeRect(this.bounds.tl.x, this.bounds.tl.y, this.bounds.size.x, this.bounds.size.y);
    }
}


function InRange(collider1, collider2) {
    const b1 = collider1.bounds;
    const b2 = collider2.bounds;

    return b2.tl.x <= b1.tl.x + b1.size.x &&
        b1.tl.x <= b2.tl.x + b2.size.x &&
        b2.tl.y <= b1.tl.y + b1.size.y &&
        b1.tl.y <= b2.tl.y + b2.size.y;
}

function LiesOnLine(point, p1, p2) {
    return Vector2.Distance(point, p1) + Vector2.Distance(point, p2) <= Vector2.Distance(p1, p2) * 1.0001;
}

function IntersectionPoint(p1, p2, p3, p4) {
    const c2x = p3.x - p4.x;
    const c3x = p1.x - p2.x;
    const c2y = p3.y - p4.y;
    const c3y = p1.y - p2.y;

    const d = c3x * c2y - c3y * c2x;

    if (d === 0) return undefined;

    const ua = p1.x * p2.y - p1.y * p2.x;
    const ub = p3.x * p4.y - p3.y * p4.x;

    const x = (ua * c2x - c3x * ub) / d;
    const y = (ua * c2y - c3y * ub) / d;

    return new Vector2(x, y);
}



function CollidingCircles(collider1, collider2, useCase = 0) {
    const c1 = collider1.centerPoint;
    const c2 = collider2.centerPoint;

    if (c1.Equals(c2)) c1.x -= 0.0001;
    let v = Vector2.Subtraction(c2, c1);

    let l = v.magnitude - collider1.radius - collider2.radius;

    if (useCase === 0) return l <= 0;
    return l > 0 ? Vector2.zero : Vector2.Scale(v.normalized, l);
}

// TODO: Implement Collision Functions
function CollidingBorders(collider1, collider2, useCase = 0) {

} 

function CollidingPolygons(collider1, collider2, useCase = 0) {

}



function CollidingCircleAndBorder(circleCollider, borderCollider, useCase = 0) {
    let out = Vector2.positiveInfinity;
    let outSign = 1;

    const edges = borderCollider.edges;
    const radius = circleCollider.radius;

    for (const i in edges) {
        let p1 = Vector2.Subtraction(edges[i][0], circleCollider.centerPoint);
        let p2 = Vector2.Subtraction(edges[i][1], circleCollider.centerPoint);

        let dp = Vector2.Subtraction(p2, p1);
        let p = dp.perpendicular;
        p.Set(IntersectionPoint(p1, p2, Vector2.zero, p));

        let m = p.magnitude;
        let m1 = p1.magnitude;
        let m2 = p2.magnitude;

        if (typeof p !== "undefined" && LiesOnLine(p, p1, p2)) {
            if (m <= radius) {
                if (useCase === 0) return true;

                let currOut = Vector2.Scale(p, radius / m - 1);
                let currSign = Math.sign(m - radius);

                if (currOut.magnitude * currSign < out.magnitude * outSign) {
                    outSign = currSign;
                    out.Set(currOut);
                }
            }
        } else if (m1 < m2) {
            if (m1 <= radius) {
                if (useCase === 0) return true;

                let currOut = Vector2.Scale(p1, radius / m1 - 1);
                let currSign = Math.sign(m1 - radius);

                if (currOut.magnitude * currSign < out.magnitude * outSign) {
                    outSign = currSign;
                    out.Set(currOut);
                }
            }
        } else if (m2 <= radius) {
            if (useCase === 0) return true;

            let currOut = Vector2.Scale(p2, radius / m2 - 1);
            let currSign = Math.sign(m2 - radius);

            if (currOut.magnitude * currSign < out.magnitude * outSign) {
                outSign = currSign;
                out.Set(currOut);
            }
        }
    }

    if (useCase === 0) return false;
    if (useCase === 2) out.Negate();

    if (out.magnitude === Infinity) out.Set(0);

    return out;
}

function CollidingCircleAndPolygon(circleCollieder, polygonCollider, useCase = 0) {

}

function CollidingBorderAndPolygon(borderCollider, polygonCollider, useCase = 0) {

}



function DetectCollision(gameObj1, gameObj2) {
    let res = new Vector2();

    const colliders1 = gameObj1.GetComponents(Collider);
    const colliders2 = gameObj2.GetComponents(Collider);

    for (const collider1 of colliders1) {
        for (const collider2 of colliders2) {
            if (!InRange(collider1, collider2)) continue;

            let getColliderClass = (obj) => {
                if (obj instanceof CircleCollider) return CircleCollider;
                if (obj instanceof BorderCollider) return BorderCollider;
                if (obj instanceof PolygonCollider) return PolygonCollider;
            }

            let class1 = getColliderClass(collider1);
            let class2 = getColliderClass(collider2);

            switch (class1) {
                case CircleCollider:
                    if (class2 === CircleCollider) res.Add(CollidingCircles(collider1, collider2, 1));
                    else if (class2 === BorderCollider) res.Add(CollidingCircleAndBorder(collider1, collider2, 1));
                    else if (class2 === PolygonCollider) res.Add(CollidingCircleAndPolygon(collider1, collider2, 1));
                    break;

                case BorderCollider:
                    if (class2 === CircleCollider) res.Add(CollidingCircleAndBorder(collider2, collider1, 2));
                    else if (class2 === BorderCollider) res.Add(CollidingBorders(collider1, collider2, 1));
                    else if (class2 === PolygonCollider) res.Add(CollidingBorderAndPolygon(collider1, collider2, 1));
                    break;

                case PolygonCollider:
                    if (class2 === CircleCollider) res.Add(CollidingCircleAndPolygon(collider2, collider1, 2));
                    else if (class2 === BorderCollider) res.Add(CollidingBorderAndPolygon(collider2, collider1, 2));
                    else if (class2 === PolygonCollider) res.Add(CollidingPolygons(collider1, collider2, 1));
                    break;
            }
        }
    }

    return res;
}
