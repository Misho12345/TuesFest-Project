"use strict";

function Clamp(value, from, to) {
    if (from > to) {
        console.warn("Values are invalid");
        return value;
    }

    if (value > to) return to;
    if (value < from) return from;

    return value;
}

function Clamp01(value) { return Clamp(value, 0, 1) }
function Rad2Deg(v) { return v / 0.017453292519943295 }
function Deg2Rad(v) { return v * 0.017453292519943295 }
function Lerp(a, b, t) { return a + (b - a) * t }