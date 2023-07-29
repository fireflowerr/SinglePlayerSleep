import {system, world, TimeOfDay } from "@minecraft/server";

const TICKS_PER_SECOND = 20;
const POLL_INTERVAL_SECONDS = 3;

/**
 * Beds can be slept in from up to 2 blocks away
 */
const SCAN_RADIUS = 2;

/**
 * Poll for sleeping player. Change time to day if sleep detected.
 */
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (isSleeping(player)) {
            world.setTimeOfDay(TimeOfDay.Day);
            return;
        }
    }
}, TICKS_PER_SECOND * POLL_INTERVAL_SECONDS);

/**
 * Returns true if the provided player is sleeping.
 * 
 * @param {import('@minecraft/server').Player} player 
 * @returns {boolean} true if sleeping
 */
const isSleeping = (player) => {
    const {y: headY} = player.getHeadLocation();
    const {x, y, z} = player.location;

    // If head and feet are near same y-level, player might be sleeping
    if (Math.abs(headY - y) > 0.5) {
        return;
    }

    // Ensure player is not in a state that precludes sleep
    const skipIfState = [
        'isClimbing',
        'isFalling',
        'isInWater',
        'isJumping',
        'isSneaking',
    ];

    const skip = skipIfState.reduce((accumulator, prop) => {
        try {
            return accumulator || player[prop];
        } catch (error) {}
        return accumulator;
    }, false);

    if (skip) {
        return;
    }

    // Check for presense of a bed
    const overworld = world.getDimension('overworld');
    const scanRange = range(-1 * SCAN_RADIUS, SCAN_RADIUS);
    const yDelta = -1;
    for (const xDelta of scanRange) {
        for (const zDelta of scanRange) {
            const block = overworld.getBlock({x: x + xDelta, y: y + yDelta, z: z + zDelta});
            if (block.type.id === 'minecraft:bed') {
                return true;
            }
        }
    }
}

/**
 * Generates a range of [start, end]. Start and end are truncated.
 * 
 * @param {number} start 
 * @param {number} end 
 * @returns 
 */
const range = (start, end) => {
    start = start | 0;
    end = end | 0;
    const result = [];
    for (let i = start; i <= end; ++i) {
        result.push(i);
    }
    return result;
}