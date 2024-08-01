import { world, system } from "@minecraft/server"

export class PunchEvent {
	static id = 0
	static callbacks = {}

	static addCallback(callback) {
		this.id++
		PunchEvent.callbacks[this.id] = callback
		return this.id
	}
	static removeCallback(id) {
		delete this.callbacks[id]
	}
}

system.runInterval(() => {
	for (const player of world.getPlayers()) {
		if (!player.hasTag("swing")) continue
		player.removeTag("swing")

		for (const callback of Object.values(PunchEvent.callbacks)) {
			callback(player)
		}
	}
})


