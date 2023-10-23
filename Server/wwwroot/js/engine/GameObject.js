"use strict";

class GameObject {
    static gameObjects = [];

    #active = true;

    components = [];
    idx;

    constructor(name = `GameObject_${GameObject.gameObjects.length}`, position = Vector2.zero, scale = Vector2.one, rotation = 0, parent) {
        this.idx = GameObject.gameObjects.length;
        GameObject.gameObjects.push(this);

        this.transform = this.AddComponent(Transform);

        this.transform.name = name;

        if (typeof this.transform.parent !== "undefined" && CheckInstance(this.transform.parent, Transform, this.constructor)) {
            this.transform.parent.transform = parent;
        }

        this.transform.position = position;
        this.transform.scale = scale;
        this.transform.rotation = rotation;
    }


    static FindObjectByName(name) {
        for (const gameObj of GameObject.gameObjects) {
            if (gameObj.transform.name === name) {
                return gameObj;
            }
        }

        return undefined;
    }

    get active() { return this.#active }


    UpdateComponents(idx) {
        for (let i = idx; i < this.components.length; i++) {
            this.components[i].idx = i;
        }
    }


    AddComponent(Type) {
        const component = new Type;

        if (!CheckInstance(component, Component, this.AddComponent)) return undefined;

        this.components.push(component);

        component.idx = this.components.length - 1;

        component.gameObject = this;
        component.transform = this.transform;

        return component;
    }

    FindComponent(type) {
        const found = this.components.find(component => component instanceof type);
        return found?.idx ?? undefined;
    }

    RemoveComponent(type) {
        if (type instanceof Transform) {
            console.warn(`You can't remove 'Transform' component`);
            return;
        }

        const foundIdx = this.FindComponent(type);

        if (typeof foundIdx === "undefined") {
            console.warn(`'${type.name}' component not found - cannot remove`);
            return;
        }

        this.components.splice(foundIdx);
        this.UpdateComponents(foundIdx);
    }

    GetComponent(type) {
        return this.components[this.FindComponent(type)];
    }

    GetComponents(type) {
        const components = [];

        for (const component of this.components)
            if (component instanceof type)
                components.push(component);

        return components;
    }


    Destroy() {
        GameObject.gameObjects.splice(this.idx);
        for (let i = this.idx; i < GameObject.gameObjects.length; i++) {
            GameObject.gameObjects[i].idx = i;
        }

        this.OnDestroyed?.call();
        delete this;
    }

    SetActive(state) {
        if (state === this.#active) return;

        this.#active = state;

        if (state) this.OnEnabled?.call();
        else this.OnDisabled?.call();
    }
}
