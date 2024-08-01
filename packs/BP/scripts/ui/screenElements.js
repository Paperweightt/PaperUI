import { world, system } from "@minecraft/server"
import { PunchEvent } from "../util/punchEvent"
import { molang } from "./font/molang"

export class Element {
	resetList = []
	elements = {}
	pixels = {}
	elementMovingIndex = 0
	offset = { x: 0, y: 0 }
	_height = 0
	_width = 0

	get height() {
		return this._height
	}

	set height(int) {
		this._height = int
	}

	get width() {
		return this._width
	}

	set width(int) {
		this._width = int
	}

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
		for (const childElement of Object.values(element.elements)) {
			element.removeElement(childElement)
		}
		delete this.elements[element.id]
	}

	addElement(element, x = 0, y = 0) {
		element.offset = { x, y }
		this.elements[this.elementMovingIndex] = element
		element.id = this.elementMovingIndex
		this.elementMovingIndex++
		element.parentElement = this

		if (this.screen) {
			element.screen = this.screen
			element.update()
		}
	}

	updateChildElements() {
		for (const element of Object.values(this.elements)) {
			element.update()
			element.updateChildElements()
		}
	}

	update() { }

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

	constructor(string = "", textOptions = {}) {
		super()
		this.string = string
		this.height = this.string.split("\n").length * this.newLinePadding
		this.font = molang
		for (const [key, value] of Object.entries(textOptions)) {
			this[key] = value
		}
	}

	update() {
		this.removeAllPixels()
		this.addStringPixels()
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

	constructor(width, height, string, font = molang) {
		super()
		this.string = string
		this.font = font
		this.width = width
		this.height = height
	}

	update() {
		this.addBox()
		this.addString()
		this.runInterval()
	}

	addOnClick(callback) {
		const id = PunchEvent.addCallback((player) => {
			const { x, y } = this.getPointer(player)
			if (x > 0 && y > 0 && y < this.height && x < this.width) {
				this.endHoverEffect()
				this.hover = false

				this.runHover = false
				system.runTimeout(() => {
					this.runHover = true
				}, 2)

				callback({ player, x, y })
			}
		})
		this.resetList.push(() => {
			PunchEvent.removeCallback(id)
		})
	}

	runInterval() {
		this.hoverId = system.runInterval(() => {
			if (!this.runHover) return

			let bool = false

			for (const player of world.getPlayers()) {
				const { x, y } = this.getPointer(player)
				if (x > 0 && y > 0 && y < this.height && x < this.width) {
					bool = true
					break
				}
			}

			if (bool) {
				if (!this.hover) {
					this.startHoverEffect()
					this.hover = true
					this.screen.update()
				}
			} else if (this.hover) {
				this.endHoverEffect()
				this.hover = false
				this.screen.update()
			}
		},)

		this.resetList.push(() => {
			system.clearRun(this.hoverId)
		})
	}

	addString() {
		this.textElement = new TextElement(this.string, { center: true, font: molang })
		const x = Math.floor((this.width - 1) / 2)
		const y = Math.floor((this.height - 1 - this.textElement.height) / 2)
		this.addElement(this.textElement, x, y)
	}

	addBox() {
		this.addElement(new ShapeElement("box", 0, 0, this.width - 1, this.height - 1))
	}

	startHoverEffect() {
		this.hoverBox = [
			new ShapeElement("line", 2, 1, this.width - 2, 1),
			new ShapeElement("line", 2, this.height - 2, this.width - 2, this.height - 2),
			new ShapeElement("line", 1, 2, 1, this.height - 2),
			new ShapeElement("line", this.width - 2, 2, this.width - 2, this.height - 2),
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

export class StackElement extends Element {
	get width() {
		let width = 0

		for (const element of Object.values(this.elements)) {
			if (this.direction === "horizontal") {
				width += element.width + this.stackOffset + 2
			} else if (element.width > width) {
				width = element.width
			}
		}

		return width
	}

	get height() {
		let height = 0

		for (const element of Object.values(this.elements)) {
			if (this.direction === "vertical") {
				height += element.height + this.stackOffset + 2
			} else if (element.height > height) {
				height = element.height
			}
		}

		return height
	}

	constructor(direction, stackOffset = 0) {
		super()
		this.direction = direction
		this.stackOffset = stackOffset
	}
	addElement(element) {
		if (this.direction === "horizontal") {
			super.addElement(element, this.width, 0)
		} else {
			super.addElement(element, 0, -this.height)
		}
	}
}
