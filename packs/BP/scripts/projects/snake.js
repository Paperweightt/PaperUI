import { world, system } from "@minecraft/server"
import { Vector } from "../util/vector"
import { Screen } from "../ui/screen"
import { ButtonElement, ShapeElement, Element, TextElement } from "../ui/screenElements"

const overworld = world.getDimension("overworld")

for (const entity of overworld.getEntities({ type: "ptb:panel" })) {
    entity.remove()
}

class Snake {
    x = 38
    y = 24
    body = []
    appleX = Math.floor(Math.random() * 73) + 1
    appleY = Math.floor(Math.random() * 46) + 1

    facing = "n"

    constructor(panel, scoreDisplay) {
        this.panel = panel
        this.scoreDisplay = scoreDisplay
        this.panel.setPixel(this.appleX, this.appleY, 1)
    }

    getScore() {
        return this.body.length
    }

    update() {
        if (!this.detectApple()) {

            this.removeTail()
        } else {
            this.scoreDisplay.string = this.getScore() + ""
            this.scoreDisplay.update()
        }

        this.move()
        this.setPixels()

        if (this.detectDeath()) {
            this.restart()
        }


        this.panel.update()
    }

    detectApple() {
        if (this.x === this.appleX && this.y === this.appleY) {
            this.panel.setPixel(this.appleX, this.appleY, 0)
            this.appleX = Math.floor(Math.random() * 73) + 1
            this.appleY = Math.floor(Math.random() * 46) + 1
            this.panel.setPixel(this.appleX, this.appleY, 1)
            return true
        }
        return false
    }

    restart() {
        this.y = 24
        this.x = 38

        for (const [x, y] of this.body) {
            this.panel.setPixel(x, y, 0)
        }

        this.scoreDisplay.string = "0"
        this.scoreDisplay.update()
        this.body = []
        this.facing = "n"
    }

    move() {
        const [x, y] = Snake.directions[this.facing]
        this.x += x
        this.y += y

        this.body.push([this.x, this.y])
    }

    removeTail() {
        const remove = this.body.shift()
        if (remove) {
            this.panel.setPixel(remove[0], remove[1], 0)
        }
    }

    detectDeath() {
        if (this.x > 75 - 1) return true
        if (this.y > 48 - 1) return true
        if (this.x < 0 + 1) return true
        if (this.y < 0 + 1) return true

        for (const [x, y] of this.body.slice(0, -1)) {
            if (this.x === x && this.y === y) return true
        }
    }

    setPixels() {
        for (const [x, y] of this.body) {
            this.panel.setPixel(x, y, 1)
        }
    }

    static directions = {
        "n": [0, 1],
        "e": [1, 0],
        "s": [0, -1],
        "w": [-1, 0]
    }
}


const panelLocation = new Vector(0, -50, 0)
const panelRotation = { x: 0, y: 54 }

const screen = new Screen(panelLocation, overworld, panelRotation)
const gamePanel = new ShapeElement("box", 0, 0, 76, 48)
const scoreDisplay = new TextElement()

screen.addElement(new ShapeElement("box", 0, 0, 80, 80))
screen.addElement(gamePanel, 2, 30)
screen.addElement(new TextElement("snake", { center: true }), 40, 80)

const snake = new Snake(gamePanel, scoreDisplay)

const buttonPanel = new Element()

const wButton = new ButtonElement(13, 13, "W")
const aButton = new ButtonElement(13, 13, "A")
const sButton = new ButtonElement(13, 13, "S")
const dButton = new ButtonElement(13, 13, "D")

wButton.addOnClick(() => {
    if (snake.facing !== "s") snake.facing = "n"
})
aButton.addOnClick(() => {
    if (snake.facing !== "e") snake.facing = "w"
})
sButton.addOnClick(() => {
    if (snake.facing !== "n") snake.facing = "s"
})
dButton.addOnClick(() => {
    if (snake.facing !== "w") snake.facing = "e"
})

buttonPanel.addElement(wButton, 14, 14)
buttonPanel.addElement(aButton, 0, 0)
buttonPanel.addElement(sButton, 14, 0)
buttonPanel.addElement(dButton, 28, 0)


screen.addElement(scoreDisplay)
screen.addElement(buttonPanel, 2, 2)
screen.addElement(scoreDisplay, 50, 2)

system.runInterval(() => {
    snake.update()
}, 2)
