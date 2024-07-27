import { Vector } from "./vector"

export class Shapes {
	static circle(radius) {
		const list = []
		for (let x = -radius; x < radius; x++) {
			for (let z = -radius; z < radius; z++) {
				if (Vector.distance(new Vector(0), new Vector(x, 0, z)) < radius)
					list.push(new Vector(x, 0, z))
			}
		}
		return list
	}

	static cylinder(radius, height) {
		const list = []
		for (let x = -radius; x < radius; x++) {
			for (let y = -(Math.floor(height / 2)); y < height / 2; y++) {
				for (let z = -radius; z < radius; z++) {
					if (Vector.distance(new Vector(0, y, 0), new Vector(x, y, z)) < radius)
						list.push(new Vector(x, y, z))
				}
			}
		}
		return list
	}

	static sphere(radius) {
		const list = []
		for (let x = -radius; x < radius; x++) {
			for (let y = -radius; y < radius; y++) {
				for (let z = -radius; z < radius; z++) {
					if (Vector.distance(new Vector(0), new Vector(x, y, z)) < radius)
						list.push(new Vector(x, y, z))
				}
			}
		}
		return list
	}

	static ellipsoid() {

	}

	static cube(size) {
		size = Math.floor(size / 2)
		const list = []
		for (let x = -size; x < size; x++) {
			for (let y = -size; y < size; y++) {
				for (let z = -size; z < size; z++) {
					list.push(new Vector(x, y, z))
				}
			}
		}
		return list
	}
}
