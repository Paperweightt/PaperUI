import { PunchEvent } from "../../punchEvent"
import { Screen } from "../../screen/screen"
import { TextElement } from "../../screen/screenElements"
import { Vector } from "../../vector"
import { molang } from "../../screen/font/molang"

// PunchEvent.addCallback((player) => {
//     let location = Vector.multiply(player.getViewDirection(), 3)
//     location = Vector.add(location, player.getHeadLocation())
//     const rotation = { x: 0, y: 180 + player.getRotation().y }
//     const screen = new Screen(location, player.dimension, rotation)
//
//     screen.addElement(new TextElement(molang, "text", { center: true }))
// })
