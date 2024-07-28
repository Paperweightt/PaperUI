import { Shape } from "./shape"
import { ButtonElement, StackElement } from "./ui/screenElements"
import { BUTTON_HEIGHT, BUTTON_WIDTH } from "./buildToolsMenu"
import { KeyIntElement } from "./customElements"
import { world } from "@minecraft/server"

export class BuildTools {
    static mainOptions = {

    }

    static addOption(name, callback) {
        this.mainOptions[name] = callback
    }
}


BuildTools.addOption("Shape", (horizStack) => {
    for (const element of Object.values(horizStack.elements)) {
        world.sendMessage(element.offset.x + "")
        // horizStack.removeElement(element)
    }

    const vertStack = new StackElement("vertical")
    horizStack.addElement(vertStack)

    for (const [name, { parameters }] of Object.entries(Shape.shapes)) {
        const button = new ButtonElement(BUTTON_WIDTH, BUTTON_HEIGHT, name)

        button.addOnClick(() => {
            const verticalStack = new StackElement("vertical")
            horizStack.addElement(verticalStack)

            for (const parameter of parameters) {
                const char = parameter.charAt(0)
                verticalStack.addElement(new KeyIntElement(BUTTON_WIDTH, BUTTON_HEIGHT, char))
            }

        })
        vertStack.addElement(button)
    }
})

BuildTools.addOption("Blocks")
BuildTools.addOption("Replace")

BuildTools.addOption("Rotation", (horizStack) => {
    for (const element of Object.values(horizStack.elements)) {
        // world.sendMessage(element.offset.x + "")
        if (element.offset.x > 55) {
            element.removeAllPixels()
            horizStack.removeElement(element)
        }
    }
    const vertStack = new StackElement("vertical")
    horizStack.addElement(vertStack)
    vertStack.addElement(new KeyIntElement(BUTTON_WIDTH, BUTTON_HEIGHT, "y"))
    vertStack.addElement(new KeyIntElement(BUTTON_WIDTH, BUTTON_HEIGHT, "p"))
    vertStack.addElement(new KeyIntElement(BUTTON_WIDTH, BUTTON_HEIGHT, "r"))
})
