PaperUI works by running animations on an entity to make pixels visible or non-visible

WARNING: 3/5 on the lag scale :')

heres some basic ways the pack can be used although the real magic comes in when these are combined together to make some really interactive ui.

<details>
  <summary>TextElement Example</summary>
  
  ## Text 
  
  - most characters but not all are suported
  - the characters are saved in "./ui/font/molang"
  
```js
import { textElement } from "./ui/screenElements"
import { screen } from "./ui/screen"
import { world } from "@minecraft/server"

const overworld = world.getDimension("overworld")

function displayText(text, location, dimension, rotation) {
    const screen = new Screen(location, dimension, rotation)
    screen.addElement(new TextElement(text))
    screen.update()
}

displayText("hello world", { x: 0, y: -55, z: 0 }, overworld, { x: 0, y: 0 })
```
</details>

<details>
  <summary>ButtonElement Example</summary>
  
  ## Button
  
  - the buttonElement consists of a textElement as well as serveral shapeElements
  - to have a blank buttonElement set text = ""
  
```js
import { buttonElement } from "./ui/screenElements"
import { screen } from "./ui/screen"
import { world } from "@minecraft/server"

const overworld = world.getDimension("overworld")

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

displayButton("button", 40, 14, { x: 0, y: -55, z: 0 }, overworld)
```
</details>

<details>
  <summary> Drawing Tool</summary>
  
  ## Drawing Tool
  
  - this doesnt use any elements but instead draws directly on the screen
  
```js
import { screen } from "./ui/screen"
import { world } from "@minecraft/server"

const overworld = world.getDimension("overworld")

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
```
</details>

## TODOS
<details>
  <summary> color </summary>

  - adding color to each individual pixel is too laggy when done via render controllers
  - swap everything over to particles possibly
</details>

<details>
  <summary> examples </summary>

  - add in some simple examples on how elements can be used together
  - a draw tool with a button to turn the drawing into blocks
  - button that generates another button
  - add in a picture of the output for each example 
</details>