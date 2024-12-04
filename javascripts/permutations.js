const _ = require('lodash')

function countcycles(list) {
    const bitmap = new Set(list)
    const cycles = []
    while (bitmap.size > 0) {
        const head = bitmap.values().next().value
        const cycle = []
        let pointer = head
        do {
            cycle.push(pointer)
            bitmap.delete(pointer)
            pointer = list[pointer]
        } while (pointer != head)
        cycles.push(cycle)
    }
    return cycles.map(v => v.length)
}

function simulate(nboxes = 3, simulationsteps = 2000) {
    const hist = new Array(nboxes).fill(0)
    for (let step = 0; step < simulationsteps; step += 1) {
        _.uniq(countcycles(_.shuffle(_.range(0, nboxes))))
         .forEach(v => hist[v - 1] += 1)
    }
    return hist.map(v => v / simulationsteps)
}

function histogram(list, width = 80, top = 15) {
    const max = _.max(list)
    _.take(list, top).forEach(v => console.log(`${v.toFixed(2)} ${"#".repeat(width * v / max)}`))
}

console.warn(JSON.stringify(simulate(nboxes = 100, simulationsteps = 500000).map((x, i) => ({ "len": i + 1, "p": x }))))