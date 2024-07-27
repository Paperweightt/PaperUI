import { world } from "@minecraft/server" // TODO: remove
import { Panel } from "./panel"
import { Vector } from "../vector"

export class Screen {
	updates = new Set()
	panels = {}
	elementMovingIndex = 0
	// elements = []
	elements = {}
	detectPointer = false
	rotation = { x: 0, y: 0 }

	constructor(location, dimension, rotation) {
		this.location = location
		this.dimension = dimension
		this.rotation = rotation
	}

	setRotation({ x, y }) {
		this.rotation = { x, y }
		for (const [xy, panel] of Object.entries(this.panels)) {
			const [x, y] = xy.split(",").map(str => +str)
			const yRotation = this.rotation.y * Math.PI / 180
			const location = Vector.rotate(new Vector(x, y, 0), 0, yRotation, 0)
			panel.entity.setRotation(this.rotation)
			panel.entity.teleport(Vector.add(location, this.location))
		}
	}

	setPixel(x, y, boolean) {
		const panel = this.getPanel(x, y)
		if (!panel) {
			this.addPanel(
				Math.floor(x / Panel.WIDTH),
				Math.floor(y / Panel.HEIGHT)
			)
			this.setPixel(x, y, boolean)
			return
		}

		x = x % Panel.WIDTH
		y = y % Panel.HEIGHT
		if (x < 0) x = Panel.WIDTH - Math.abs(x)
		if (y < 0) y = Panel.HEIGHT - Math.abs(y)

		panel.setPixel(x, y, boolean)
	}

	addPanel(x, y) {
		const yRotation = this.rotation.y * Math.PI / 180
		const location = Vector.rotate(new Vector(x, y, 0), 0, yRotation, 0)
		const panel = new Panel(Vector.add(location, this.location), this.dimension)
		panel.entity.setRotation(this.rotation)
		this.panels[[x, y]] = panel
	}

	getPanel(x, y) {
		return this.panels[[
			Math.floor(x / Panel.WIDTH),
			Math.floor(y / Panel.HEIGHT)
		]]
	}

	addElement(element, x = 0, y = 0) {
		this.elements[this.elementMovingIndex] = element
		element.id = this.elementMovingIndex
		this.elementMovingIndex++

		element.offset = { x, y }
		element.parentElement = this
		element.setScreen(this) // TODO:what does this do?
		element.update()
		element.updateChildElements()

		this.update()
	}

	removeElement(element) {
		element.removeAllPixels()
		delete this.elements[element.id]
		screen.update()
	}

	getPixel(x, y) {
		for (const element of Object.values(this.elements)) {
			if (element.getPixel(x - element.offset.x, y - element.offset.y)) return 1
		}
		return 0
	}
	addUpdate(x, y) {
		this.updates.add([x, y])
	}

	update() {
		for (const [x, y] of this.updates) {
			this.setPixel(x, y, this.getPixel(x, y))
		}
		this.updates.clear()
	}

	getPointer(player) {
		const { z: dz, x: dx, y: dy } = Vector.subtract(this.location, player.getHeadLocation())
		const playerRotationY = (180 - player.getRotation().y) * Math.PI / 180
		const screenRotationY = ((90 - this.rotation.y) % 360) * Math.PI / 180
		let xy, xx, flip

		if (!Math.sin(screenRotationY) && !Math.sin(playerRotationY)) return

		const a2 = 1 / Math.tan(playerRotationY)
		const c2 = dz - a2 * dx
		if (Math.sin(screenRotationY)) {
			const a1 = 1 / Math.tan(screenRotationY)
			xy = c2 * a1 / (a1 - a2)
			xx = c2 / (a1 - a2)
		} else {
			xx = 0
			xy = c2
		}

		if ((this.rotation.y >= 0 && this.rotation.y < 90 && xx < 0) ||
			(this.rotation.y >= 90 && this.rotation.y < 180 && xy < 0) ||
			(this.rotation.y >= 180 && this.rotation.y < 270 && xx > 0) ||
			(this.rotation.y >= 270 && xy > 0)) {
			flip = true
		}

		const x = (Math.sqrt(xy ** 2 + xx ** 2)) * (flip ? 1 : -1)
		const ya = Vector.distance(new Vector(xx, 0, xy), new Vector(dx, 0, dz))
		const xPheta = 180 - player.getRotation().x
		const y = ya * Math.tan(xPheta * Math.PI / 180) - dy
		return { x: Math.round(x * Panel.WIDTH) + 16, y: Math.round(y * Panel.WIDTH) + 3 }
	}
}
