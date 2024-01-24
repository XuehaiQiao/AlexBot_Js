module.exports = {
    rangeAtker: {
        4: {
            body: [...new Array(7).fill(MOVE), ...new Array(4).fill(RANGED_ATTACK), ...new Array(3).fill(HEAL)],
            boosted: false,
        },

        5: {
            body: [...new Array(9).fill(MOVE), ...new Array(5).fill(RANGED_ATTACK), ...new Array(4).fill(HEAL)],
            boosted: false,
        },
    }
}