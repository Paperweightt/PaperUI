import { world, system } from "@minecraft/server"

export class PunchEvent {
	static callbacks = []

	static addCallback(callback) {
		PunchEvent.callbacks.push(callback)
	}
}

system.runInterval(() => {
	for (const player of world.getPlayers()) {
		if (!player.hasTag("swing")) continue
		player.removeTag("swing")

		for (const callback of PunchEvent.callbacks) {
			callback(player)
		}
	}
})


