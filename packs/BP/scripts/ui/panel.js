import { world, system } from '@minecraft/server'

export class Panel {
	static WIDTH = 32
	static HEIGHT = 32
	static FIRST_RUN_TIMEOUT = 4

	firstLoad = true
	instructions = []
	pixels = Array.from({ length: Panel.HEIGHT }).map(() => Array(Panel.WIDTH).fill(0))

	constructor(location, dimension) {
		this.entity = dimension.spawnEntity("ptb:panel", location)
	}

	clear() {
		for (let x = 0; x < Panel.WIDTH; x++) {
			for (let y = 0; y < Panel.HEIGHT; y++) {
				this.removePixel(x, y)
			}
		}
	}

	addPixel(x, y) {
		if (this.firstLoad) {
			system.runTimeout(() => {
				this.pixels[y][x] = 1
				this.entity.runCommand(`playanimation @s animation.panel.${x}_${y} null 0 "0" "${x}_${y}"`)
				this.firstLoad = false
			}, Panel.FIRST_RUN_TIMEOUT)
			return
		}
		this.pixels[y][x] = 1
		this.entity.runCommand(`playanimation @s animation.panel.${x}_${y} null 0 "0" "${x}_${y}"`)
	}

	removePixel(x, y) {
		if (this.firstLoad) {
			system.runTimeout(() => {
				this.pixels[y][x] = 0
				this.entity.runCommand(`playanimation @s animation.ghast.scale null 0 "0" "${x}_${y}"`)
				this.firstLoad = false
			}, Panel.FIRST_RUN_TIMEOUT)
			return
		}
		this.pixels[y][x] = 0
		this.entity.runCommand(`playanimation @s animation.ghast.scale null 0 "0" "${x}_${y}"`)
	}

	setPixel(x, y, boolean) {
		if (boolean) {
			this.addPixel(x, y)
		} else {
			this.removePixel(x, y)
		}
	}
}
