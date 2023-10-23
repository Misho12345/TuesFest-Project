"use strict";

function CheckInstance(v, t, func) {
    if (v instanceof t) return true;

    console.warn(`Value must be an instance of ${t.name} when calling ${func.name}()`);
    return false;
}

class Component {
    #enabled = true;

    idx;
    gameObject;
    transform;

    SetEnabled(state) {
        if (this.#enabled === state) return;

        this.#enabled = state;

        if (this.#enabled) this.OnEnabled?.call();
        else this.OnDisabled?.call();
    }

    get enabled() { return this.#enabled }
}
