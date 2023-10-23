"use strict";

class Vector2 {
    x;
    y;

    constructor(x = 0, y) {
        this.x = x;
        this.y = y ?? x;
    }

    static get zero() { return new Vector2(0, 0) }
    static get one() { return new Vector2(1, 1) }

    static get up() { return new Vector2(0, -1) }
    static get down() { return new Vector2(0, 1) }
    static get left() { return new Vector2(-1, 0) }
    static get right() { return new Vector2(1, 0) }

    static get positiveInfinity() { return new Vector2(Infinity, Infinity) }
    static get negativeInfinity() { return new Vector2(-Infinity, -Infinity) }

    get negative()      { return new Vector2(-this.x, -this.y) }
    get sqrMagnitude()  { return this.x * this.x + this.y * this.y }
    get magnitude()     { return Math.sqrt(this.sqrMagnitude) }
    get sumOfElements() { return this.x + this.y }
    get copy()          { return new Vector2(this.x, this.y) }

    get perpendicular() { return new Vector2(-this.y, this.x) }

    get normalized() {
        const magnitude = this.magnitude;
        const vector = this.copy;

        if (magnitude > 9.9999997473787516e-06) vector.Scale(1 / magnitude);
        else vector.Set(Vector2.zero);

        return vector;
    }


    Equals = (vec) => this.x === vec.x && this.y === vec.y;

    Scale(x, y) {
        if (typeof x == "number" && typeof y === "undefined") {
            this.x *= x;
            this.y *= x;
        } else if (typeof x == "number" && typeof y === "number") {
            this.x *= x;
            this.y *= y;
        } else if (x instanceof Vector2 && typeof y === "undefined") {
            this.x *= x.x;
            this.y *= x.y;
        }
    }

    Add(x, y) {
        if (typeof x == "number" && typeof y === "undefined") {
            this.x += x;
            this.y += x;
        } else if (typeof x == "number" && typeof y === "number") {
            this.x += x;
            this.y += y;
        } else if (x instanceof Vector2 && typeof y === "undefined") {
            this.x += x.x;
            this.y += x.y;
        }
    }

    Subtract(x, y) {
        if (typeof x == "number" && typeof y === "undefined") {
            this.x -= x;
            this.y -= x;
        } else if (typeof x == "number" && typeof y === "number") {
            this.x -= x;
            this.y -= y;
        } else if (x instanceof Vector2 && typeof y === "undefined") {
            this.x -= x.x;
            this.y -= x.y;
        }
    }

    Set(x, y) {
        if (typeof x == "number" && typeof y == "undefined") {
            this.x = x;
            this.y = x;
        } else if (typeof x == "number" && typeof y == "number") {
            this.x = x;
            this.y = y;
        } else if (x instanceof Vector2 && typeof y === "undefined") {
            this.x = x.x;
            this.y = x.y;
        }
    }


    Negate() {
        this.x = -this.x;
        this.y = -this.y;
    }

    Normalize = () => this.Set(this.normalized);


    static Distance = (a, b) => a.DistanceFrom(b);
    DistanceFrom = (vec) => new Vector2(this.x - vec.x, this.y - vec.y).magnitude;


    static Sum(vec1, vec2) {
        let newVec = vec1.copy;
        newVec.Add(vec2);
        return newVec;
    }

    static Subtraction(vec1, vec2) {
        let newVec = vec1.copy;
        newVec.Subtract(vec2);
        return newVec;
    }

    static Scale(vec1, vec2) {
        let newVec = vec1.copy;
        newVec.Scale(vec2);
        return newVec;
    }


    static LerpUnclamped = (a, b, t) => new Vector2(Lerp(a.x, b.x, t), Lerp(a.y, b.y, t));
    static Lerp = (a, b, t) => Vector2.Lerp(a, b, Clamp01(t));


    static Dot = (vec1, vec2) => vec1.x * vec2.x + vec1.y * vec2.y;
    DotProduct = (vec) => Vector2.Dot(this, vec);

    static Angle = (from, to) => Math.acos(Vector2.Dot(from, to) / from.magnitude / to.magnitude);
    static SignedAngle = (from, to) => Vector2.Angle(from, to) * Math.sign(from.x * to.y - from.y * to.x);


    static Reflect(vec, normal) {
        const num = -2 * Vector2.Dot(normal, vec);
        return new Vector2(num * normal.x + vec.x, num * normal.y + vec.y);
    }


    static MoveTowards(current, target, maxDistance) {
        maxDistance *= deltaTime;

        const num1 = target.x - current.x;
        const num2 = target.y - current.y;
        const d = (num1 * num1 + num2 * num2);

        if (d === 0 || maxDistance >= 0.0 && d <= maxDistance * maxDistance) {
            return target;
        }

        const num3 = Math.sqrt(d);

        return new Vector2(
            current.x + num1 / num3 * maxDistance,
            current.y + num2 / num3 * maxDistance);
    }
}
