"use strict";

let deltaTime;
let time;

function resizePage() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function start() {
    resizePage();
    time = new Date();

    for (const gObj of GameObject.gameObjects)
        for (const component of gObj.components)
                component.Awake?.call(component);

    for (const gObj of GameObject.gameObjects) {
        if (!gObj.active) continue;
        for (const component of gObj.components)
            if (component.enabled)
                component.Start?.call(component);
    }

    update();
}

function update() {
    deltaTime = (new Date() - time) / 100;
    time = new Date();

    window.onresize = resizePage();

    context.translate(canvas.width / 2, canvas.height / 2);

    context.globalAlpha = 1;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const gObj of GameObject.gameObjects) {
        if (!gObj.active) continue;
        for (const component of gObj.components)
            if (component.enabled)
                component.EarlyUpdate?.call(component);
    }

    for (const gObj of GameObject.gameObjects) {
        if (!gObj.active) continue;
        for (const component of gObj.components)
            if (component.enabled)
                component.Update?.call(component);
    }

    for (const gObj of GameObject.gameObjects) {
        if (!gObj.active) continue;
        for (const component of gObj.components)
            if (component.enabled)
                component.LateUpdate?.call(component);
    }

    setTimeout(update, 5);
}
