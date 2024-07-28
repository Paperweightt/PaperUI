import { world } from "@minecraft/server"
import { Vector } from "./util/vector"
import { Screen } from "./ui/screen"
import { StackElement, ButtonElement } from "./ui/screenElements"
import { BuildTools } from "./buildTools"

export const BUTTON_WIDTH = 54
export const BUTTON_HEIGHT = 13


const overworld = world.getDimension("overworld")

for (const entity of overworld.getEntities({ type: "ptb:panel" })) {
    entity.remove()
}

const location = new Vector(0, -50, 0)
const screen = new Screen(location, overworld)
const tabManager = new StackElement("horizontal")
const leftPanel = new StackElement("vertical")

for (const [name, callback] of Object.entries(BuildTools.mainOptions)) {
    const button = new ButtonElement(BUTTON_WIDTH, BUTTON_HEIGHT, name)
    button.addOnClick(() => {
        callback(tabManager)
    })
    leftPanel.addElement(button)
}


tabManager.addElement(leftPanel)
screen.addElement(tabManager)
screen.update()
