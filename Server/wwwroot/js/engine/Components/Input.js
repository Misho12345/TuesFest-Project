"use strict";

let isKeyDown = {};
let isKeyPressed = {};
let isKeyUp = {};


window.addEventListener("keydown", key => {
    isKeyDown[key.code] = !isKeyPressed[key.code];
    isKeyPressed[key.code] = true;
});

window.addEventListener("keyup", key => {
    isKeyUp[key.code] = true;
});


class Action {
    input;
    bind;
    idx;

    onDown;
    onPressed;
    onUp;

    constructor(input, bind, onDown, onPressed, onUp) {
        this.idx = input.actions.length;
        this.bind = bind;

        this.onDown = onDown;
        this.onPressed = onPressed;
        this.onUp = onUp;

        this.input = input;

        this.input.actions.push(this);
    }
}

class Input extends Component {

    actions = [];

    EarlyUpdate() {
        for (const action of this.actions) {
            if (isKeyUp[action.bind]) {
                isKeyDown[action.bind] = false;
                isKeyPressed[action.bind] = false;
                isKeyUp[action.bind] = false;
                action.onUp?.call(this.gameObject);    
            }
            else if (isKeyDown[action.bind]) {
                isKeyDown[action.bind] = false;
                action.onDown?.call(this.gameObject);
            }
            else if (isKeyPressed[action.bind]) {
                action.onPressed?.call(this.gameObject);
            }
        }
    }

    UpdateActions(idx) {
        for (let i = idx; i < this.actions.length; i++) {
            this.actions[i].idx = i;
        }
    }

    AddAction(bind, onDown, onPressed, onUp) {
        const action = new Action(this, bind, onDown, onPressed, onUp);
        this.actions.push(action);

        action.idx = this.actions.length - 1;
        action.gameObject = this;
        action.transform = this.transform;

        return action;
    }

    FindActionIdx(bind) {
        let found;

        for (const action of this.actions) {
            if (action.bind === bind) {
                found = action.idx;
                break;
            }
        }

        return found;
    }

    GetAction(bind) {
        return this.actions[this.FindActionIdx(bind)];
    }

    RemoveAction(bind) {
        const foundIdx = this.GetAction(bind);

        if (typeof foundIdx === "undefined") {
            console.warn(`action with binding '${bind}' doesn't exist - cannot be removed`);
            return;
        }

        this.actions.splice(foundIdx);
        this.UpdateActions(foundIdx);
    }
}
