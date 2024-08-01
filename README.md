PaperUI works by running animations on an entity to make pixels visible or non-visible

WARNING: 3/5 on the lag scale :')

<details>
  <summary>TextElement Example</summary>
  
  ## Text 
  
  - most characters but not all are suported
  - the characters are saved in "./ui/font/molang"
  
```js
import { textElement } from "./ui/screenElements"
import { screen } from "./ui/screen"
import { world } from "@minecraft/server"

function displayText(text, location, dimension, rotation) {
    const screen = new screen(location, dimension, rotation)
    screen.addElement(new TextElement(text))
    screen.update()
}

const overworld = world.getDimension("overworld")
displayText("hello world", {x:0, y: -55, z: 0}, {x: 0, y: 0}, overworld)
```
</details>

<details>
  <summary>ButtonElement Example</summary>
  
  ## Button
  
  - the buttonElement consists of a textElement as well as serveral shapeElements
  - to have an blank buttonElement set text = ""
  
```js
import { buttonElement } from "./ui/screenElements"
import { screen } from "./ui/screen"
import { world } from "@minecraft/server"

function displayButton(text, height, width location, dimension, rotation) {
    const screen = new screen(location, dimension, rotation)
    const button = new buttonElement(height, width, text)

    button.addOnClick(()=> {
        world.sendMessage("hello")
    })

    screen.addElement(button)
    screen.update()
}

const overworld = world.getDimension("overworld")
displayButton("button", 10, 30 {x:0, y: -55, z: 0}, overworld)
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
const display = new screen({x:0, y: -55, z: 0}, overworld)

system.runInterval(()=> {
    for (const player of world.getPlayers()) {
        const {x,y} = display.getPointer(player)

        display.setPixel(x, y, true)
    }
})
```
</details>