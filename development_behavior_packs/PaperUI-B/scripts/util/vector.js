export class Vector {
	constructor(x, y, z) {
		this.x = x
		this.y = y
		this.z = z
	}

	static equals(a, b) {
		if (a.x !== b.x) return false
		if (a.y !== b.y) return false
		if (a.z !== b.z) return false
		return true
	}

	static isBetween({ x, y, z }, a, b) {
		if (!((a.x < x && x < b.x) || (a.x > x && x > b.x))) return false
		if (!((a.y < y && y < b.y) || (a.y > y && y > b.y))) return false
		if (!((a.z < z && z < b.z) || (a.z > z && z > b.z))) return false
		return true
	}

	static multiply(a, b) {
		if (typeof b === "number")
			return new Vector(a.x * b, a.y * b, a.z * b)
		return new Vector(a.x * b.x, a.y * b.y, a.z * b.z,)
	}

	static divide(a, b) {
		if (typeof b === "number")
			return new Vector(a.x / b, a.y / b, a.z / b)
		return new Vector(a.x / b.x, a.y / b.y, a.z / b.z,)
	}

	static add(a, b) {
		if (typeof b === "number")
			return new Vector(a.x + b, a.y + b, a.z + b)
		return new Vector(a.x + b.x, a.y + b.y, a.z + b.z)
	}

	static subtract(a, b) {
		if (typeof b === "number")
			return new Vector(a.x - b, a.y - b, a.z - b)
		return new Vector(a.x - b.x, a.y - b.y, a.z - b.z)
	}

	static modulus(a, b) {
		if (typeof b === "number")
			return new Vector(a.x % b, a.y % b, a.z % b)
		return new Vector(a.x % b.x, a.y % b.y, a.z % b.z)
	}

	static distance(a, b) {
		return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2 + (b.z - a.z) ** 2)
	}
	static map(a, callback) {
		return new Vector(callback(a.x), callback(a.y), callback(a.z))

	}
	static rotate({ x, y, z }, a, b, u) {
		const cos = Math.cos
		const sin = Math.sin

		return new Vector(
			(x * (cos(a) * cos(b))) +
			(y * (sin(a) * cos(b))) +
			(z * (-sin(b))),

			(x * (cos(a) * sin(b) * sin(u) - sin(a) * cos(u))) +
			(y * (sin(a) * sin(b) * sin(u) + cos(a) * cos(u))) +
			(z * (cos(b) * sin(u))),

			(x * (cos(a) * sin(b) * cos(u) + sin(a) * sin(u))) +
			(y * (sin(a) * sin(b) * cos(u) - cos(a) * sin(u))) +
			(z * (cos(b) * cos(u)))
		)
	}
}
