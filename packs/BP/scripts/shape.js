import { Vector } from "./util/vector"

export class Shape {
    static shapes = {}

    static addShape(name, parameters, callback) {
        this.shapes[name] = { parameters, callback }
    }
}

Shape.addShape("shpere", ["radius"], (radius) => {
    const blocks = []
    const zero = new Vector(0)
    for (let x = -radius; x < radius; x++) {
        for (let y = -radius; y < radius; y++) {
            for (let z = -radius; z < radius; z++) {
                const location = new Vector(x, y, z)
                if (Vector.distance(zero, location) < radius) {
                    blocks.push(location)
                }
            }
        }
    }
    return blocks
})

Shape.addShape("cube", ["size"], (size) => {
    const blocks = []
    for (let x = -size / 2; x < size / 2; x++) {
        for (let y = -size; y < size / 2; y++) {
            for (let z = -size / 2; z < size / 2; z++) {
                const location = new Vector(x, y, z)
                blocks.push(location)
            }
        }
    }
    return blocks
})

Shape.addShape("rectangle", ["length", "width", "height"], (l, w, h) => {
    const blocks = []
    for (let x = -l / 2; x < l / 2; x++) {
        for (let y = -h / 2; x < h / 2; y++) {
            for (let z = -w / 2; x < w / 2; x++) {
                blocks.push(new Vector(x, y, z))
            }
        }
    }
    return blocks
})
