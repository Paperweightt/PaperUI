import { world, system } from "@minecraft/server"
import { PunchEvent } from "../punchEvent"

export class Element {
	resetList = []
	elements = {}
	pixels = {}
	height = 0
	elementMovingIndex = 0
	width = 0
	offset = { x: 0, y: 0 }


	setPixel(x, y, boolean) {
		if (this.pixels[[x, y]] !== boolean) {
			this.addUpdate(x, y)

			this.pixels[[x, y]] = boolean
			//{
			// delete this.pixels[[x, y]]
			// }
		}
	}

	addUpdate(x, y) {
		this.parentElement.addUpdate(x + this.offset.x, y + this.offset.y)
	}

	getPixel(x, y) {
		if (this.pixels[[x, y]]) return 1

		for (const element of Object.values(this.elements)) {
			if (element.getPixel(x - element.offset.x, y - element.offset.y)) return 1
		}
		return 0
	}

	removeAllPixels() {
		for (const key of Object.keys(this.pixels)) {
			let [x, y] = key.split(",").map(v => +v)
			this.setPixel(x, y, 0)
		}
		this.pixels = {}
	}

	removeElement(element) {
		element.removeAllPixels()
		for (const callback of element.resetList) {
			callback()
		}
		delete this.elements[element.id]
		element.screen.update()
	}

	addElement(element, x = 0, y = 0) {
		element.offset = {
			x: x,
			y: y
		}
		this.elements[this.elementMovingIndex] = element
		element.id = this.elementMovingIndex
		this.elementMovingIndex++
		element.parentElement = this

		if (this.screen) {
			element.screen = this.screen
			element.update()
			this.screen.update()
		}
	}
	updateChildElements() {
		for (const element of Object.values(this.elements)) {
			element.update()
			element.updateChildElements()
		}
	}

	update() {
		this.screen.update()
	}

	setScreen(screen) {
		this.screen = screen

		for (const element of Object.values(this.elements)) {
			element.setScreen(screen)
		}
	}

	getPointer(player) {
		const { x, y } = this.parentElement.getPointer(player)
		return { x: x - this.offset.x, y: y - this.offset.y }
	}
}

export class TextElement extends Element {
	newLinePadding = 9
	center = false

	constructor(font, string = "", textOptions = {}) {
		super()
		this.font = font
		this.string = string
		this.height = this.string.split("\n").length * this.newLinePadding

		for (const [key, value] of Object.entries(textOptions)) {
			this[key] = value
		}
	}

	update() {
		this.removeAllPixels()
		this.addStringPixels()
		super.update()
	}

	addStringPixels() {
		let yOffset = 0

		for (const string of this.string.split("\n")) {
			this.addLine(string, 0, yOffset)
			yOffset -= this.newLinePadding
		}
	}

	getLinePixelLength(string) {
		let length = 0
		for (let i = 0; i < string.length; i++) {
			const char = string[i]
			if (!this.font[char]) {
				continue
			}
			length += this.font[char][0].length + 1
		}
		return length
	}

	addLine(string, xOffset, yOffset) {
		if (this.center) xOffset -= Math.floor(this.getLinePixelLength(string) / 2) - 1

		for (let i = 0; i < string.length; i++) {
			const char = string[i]
			if (!this.font[char]) {
				world.sendMessage(char)
				continue
			}

			this.addChar(char, xOffset, yOffset)
			xOffset += this.font[char][0].length + 1
		}
	}

	addChar(char, xOffset, yOffset) {
		const width = this.font[char][0].length
		const height = this.font[char].length

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				if (this.font[char][y][x])
					this.setPixel(x + xOffset, height - y + yOffset, 1)
			}
		}
	}
}

export class ShapeElement extends Element {
	constructor(shape, x1, y1, x2, y2) {
		super()
		this.shape = shape
		this.x1 = x1
		this.y1 = y1
		this.x2 = x2
		this.y2 = y2
	}

	update() {
		this[this.shape](this.x1, this.y1, this.x2, this.y2)
		// this.setPixel(1, 1, 1)
		super.update()
	}

	line(x1, y1, x2, y2) {
		const slope = (y2 - y1) / (x2 - x1)
		const b = y1 - slope * x1

		if (x2 - x1 === 0) {
			for (let i = y1; i < y2; i++) {
				this.setPixel(x1, i, 1)
			}
			return
		}

		if (slope <= 1) {
			for (let i = x1; i < x2; i++) {
				const y = Math.floor(slope * i + b)
				this.setPixel(i, y, 1)
			}
			return
		} else {
			for (let i = y1; i < y2; i++) {
				const x = Math.floor((i - b) / slope)
				this.setPixel(x, i, 1)
			}
		}
	}

	box(x1, y1, x2, y2) {
		this.line(x1, y1 + 1, x1, y2) // left
		this.line(x2, y1 + 1, x2, y2) // right
		this.line(x1, y2, x2 + 1, y2) // top
		this.line(x1, y1, x2 + 1, y1) // bottom
	}
}

export class ButtonElement extends Element {
	clickEvents = []
	hoverEvents = []
	hover = false
	runHover = true

	constructor(x1, y1, x2, y2, string, font) {
		super()
		this.x1 = x1
		this.y1 = y1
		this.x2 = x2
		this.y2 = y2
		this.string = string
		this.font = font
		this.width = x2 - x1
		this.height = y2 - y1
	}

	update() {
		this.addBox()
		this.addString()
		this.runInterval()
		super.update()
	}

	addOnClick(callback) {
		PunchEvent.addCallback((player) => {
			const { x, y } = this.getPointer(player)
			if (x > this.x1 && y > this.y1 && y < this.y2 && x < this.x2) {
				this.endHoverEffect()
				this.hover = false

				this.runHover = false
				system.runTimeout(() => {
					this.runHover = true
				}, 2)

				callback({ player, x, y })
			}
		})
	}

	runInterval() {
		this.hoverId = system.runInterval(() => {
			if (!this.runHover) return

			let bool = false

			for (const player of world.getPlayers()) {
				const { x, y } = this.getPointer(player)
				if (x > this.x1 && y > this.y1 && y < this.y2 && x < this.x2) {
					bool = true
					player.hover = true
				} else {
					player.hover = false
				}
			}

			if (bool) {
				if (!this.hover) {
					this.startHoverEffect()
					this.hover = true
				}
			} else if (this.hover) {
				this.endHoverEffect()
				this.hover = false
			}
		}, 3)
		this.resetList.push(() => {
			system.clearRun(this.hoverId)
		})
	}

	addString() {
		this.textElement = new TextElement(this.font, this.string)
		this.textElement.center = true
		const x = this.width / 2
		const y = Math.floor((this.height - this.textElement.height) / 2)
		this.addElement(this.textElement, x, y)
	}

	addBox() {
		this.boxElement = new ShapeElement(
			"box",
			this.x1,
			this.y1,
			this.x2,
			this.y2,
		)
		this.addElement(this.boxElement)
	}

	startHoverEffect() {
		this.hoverBox = [
			new ShapeElement("line", 2, 1, this.x2 - 1, 1),
			new ShapeElement("line", 2, this.y2 - 1, this.x2 - 1, this.y2 - 1),
			new ShapeElement("line", 1, 2, 1, this.y2 - 1),
			new ShapeElement("line", this.x2 - 1, 2, this.x2 - 1, this.y2 - 1),
		]
		for (const element of this.hoverBox) {
			this.addElement(element)
		}
	}

	endHoverEffect() {
		for (const element of this.hoverBox) {
			this.removeElement(element)
		}
	}


}
