import { world } from "@minecraft/server"
import { Vector } from "../../util/vector"
import { Screen } from "../../ui/screen"
import { StackElement, ButtonElement } from "../../ui/screenElements"
import { BuildTools } from "./main"
import { PunchEvent } from "../../util/punchEvent"

export const BUTTON_WIDTH = 54
export const BUTTON_HEIGHT = 13

const overworld = world.getDimension("overworld")

for (const entity of overworld.getEntities({ type: "ptb:panel" })) {
    entity.remove()
}

class BuildToolMenu {
    static list = {}

    static remove(id) {
        if (!BuildToolMenu.list[id]) return
        BuildToolMenu.list[id].screen.remove()
        delete BuildToolMenu.list[id]
    }

    constructor(player) {
        const viewDirection = Vector.multiply(player.getViewDirection(), 3.7)

        this.location = Vector.add(player.getHeadLocation(), viewDirection)
        this.rotation = { x: 180 + player.getRotation().x, y: 180 + player.getRotation().y }
        this.dimension = player.dimension
        this.screen = new Screen(this.location, this.dimension, this.rotation)
        this.player = player
        this.id = player.id
        this.initScreen()

        BuildToolMenu.remove(this.id)
        BuildToolMenu.list[this.id] = this
    }

    initScreen() {
        const tabManager = new StackElement("horizontal")
        const leftPanel = new StackElement("vertical")
        const closeButton = new ButtonElement(BUTTON_HEIGHT, BUTTON_HEIGHT, "x")

        closeButton.addOnClick(() => { BuildToolMenu.remove(this.id) })
        for (const [name, callback] of Object.entries(BuildTools.mainOptions)) {
            const button = new ButtonElement(BUTTON_WIDTH, BUTTON_HEIGHT, name)
            button.addOnClick(() => {
                callback(tabManager)
            })
            leftPanel.addElement(button)
            this.screen.update()
        }

        tabManager.addElement(closeButton)
        tabManager.addElement(leftPanel)
        this.screen.addElement(tabManager)
        closeButton.textElement.removeAllPixels()
        closeButton.textElement.offset.y += 1
        closeButton.textElement.update()
        this.screen.update()
    }
}

PunchEvent.addCallback((player) => {
    const item = player.getComponent("inventory").container.getItem(player.selectedSlotIndex)
    if (item?.typeId !== "minecraft:netherite_axe") return
    if (!BuildToolMenu.list[player.id]) new BuildToolMenu(player)
})
