PaperUI works by running animations on an entity to make pixels visible or non-visible, its a simple idea, now lets take it and run with it

WARNING: 3/5 on the lag scale :')

([])
```
import { textElement } from "./ui/screenElements"
import { screen } from "./ui/screen"
import { world } from "@minecraft/server"

function displayText(text, location, dimension, rotation) {
    const screen = new screen(location, dimension, rotation)
    screen.addElement(new TextElement(text))
    screen.update()
}

cosnt overworld = world.getDimension("overworld")
displayText("hello world", {x:0, y: -55, z: 0}, overworld)
```

