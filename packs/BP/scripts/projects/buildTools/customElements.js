import { ButtonElement, Element, ShapeElement, TextElement } from "../../ui/screenElements"

export class CustomButton extends ButtonElement {
    constructor(width, height, string) {
        super(width, height, string)
    }

    addBox() { }
    startHoverEffect() { }
    endHoverEffect() { }
}

export class CloseButton extends ButtonElement {
    constructor(width, height, string) {
        super(width, height, string)
    }

}

export class KeyIntElement extends Element {
    constructor(width, height, string, value = 0) {
        super()
        this.height = height
        this.width = width
        this.string = string
        this.value = value
    }

    update() {
        this.addElement(new ShapeElement("box", 0, 0, this.width - 1, this.height - 1))
        this.addButtons()
        this.addText()
    }

    addButtons() {
        const dec = new CustomButton(5, 9, "<")
        const incr = new CustomButton(5, 9, ">")
        const dec10 = new CustomButton(5, 9, "<")
        const incr10 = new CustomButton(5, 9, ">")

        dec.addOnClick(() => {
            if (this.value > 0) this.value--
            this.updateText()
        })
        incr.addOnClick(() => {
            if (this.value < 999) this.value++
            this.updateText()
        })
        dec10.addOnClick(() => {
            this.value = Math.max(this.value - 10, 0)
            this.updateText()
        })
        incr10.addOnClick(() => {
            this.value = Math.min(this.value + 10, 999)
            this.updateText()
        })

        this.addElement(dec10, 33, 2)
        this.addElement(dec, 37, 2)
        this.addElement(incr, 43, 2)
        this.addElement(incr10, 47, 2)
    }

    addText() {
        this.textElement = new TextElement(`${this.string}: ${this.value}`)
        this.addElement(this.textElement, 3, 1)
    }

    updateText() {
        this.textElement.string = `${this.string}: ${this.value}`
        this.textElement.update()
    }
}

export class BlockListElement extends ButtonElement {
    constructor(width, height) {
        super(width, height)
    }
}





