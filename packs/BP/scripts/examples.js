import { world, system } from "@minecraft/server";
import { ButtonElement, TextElement } from "./ui/screenElements"
import { Screen } from "./ui/screen"

const overworld = world.getDimension("overworld")

//--- [text] ---
function displayText(text, location, dimension, rotation) {
    const screen = new Screen(location, dimension, rotation)
    screen.addElement(new TextElement(text))
    screen.update()
}

// displayText("hello world", { x: 0, y: -55, z: 0 }, overworld, { x: 0, y: 0 })

//--- [button] ---
function displayButton(text, height, width, location, dimension, rotation) {
    const screen = new Screen(location, dimension, rotation)
    const button = new ButtonElement(height, width, text)

    button.addOnClick((data) => {
        const { location: { x, y }, player } = data
        world.sendMessage(`${player.name} clicked at ${x}, ${y}`)
    })

    screen.addElement(button)
    screen.update()
}

// displayButton("button", 40, 14, { x: 0, y: -55, z: 0 }, overworld)


//--- [draw tool] ---

function displayWhiteboard() {
    const display = new Screen({ x: 0, y: -55, z: 0 }, overworld)

    system.runInterval(() => {
        for (const player of world.getPlayers()) {
            const { x, y } = display.getPointer(player)

            display.setPixel(x, y, true)
        }
    })
}

displayWhiteboard()
