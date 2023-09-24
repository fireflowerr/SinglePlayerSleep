import {system, world, TimeOfDay } from "@minecraft/server";

const TICKS_PER_SECOND = 20;
const POLL_INTERVAL_SECONDS = 1.5;

/**
 * Poll for sleeping player. Change time to day if sleep detected.
 */
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (player.isSleeping) {
            world.setTimeOfDay(TimeOfDay.Day);
            return;
        }
    }
}, TICKS_PER_SECOND * POLL_INTERVAL_SECONDS);
