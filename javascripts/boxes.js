const _ = require('lodash')
const util = require('util')

function simulate(nprisoners = 100, canopen = 50, simulationsteps = 1000) {
    const nboxes = nprisoners
    const prisoners = boxes = _.range(0, nprisoners)

    let nsuccesses = 0

    const naive = (cards, p) =>
        _.take(_.shuffle(boxes), canopen)
         .some(b => cards[b] === p)

    const cycles = (cards, p) => {
        let opened = 0
        let current = p
        while (opened < canopen) {
            if (cards[current] === p) return true
            else current = cards[current]
            opened += 1
        }
        return false
    }

    for (let step = 0; step < simulationsteps; step += 1) {
        const cards = _.shuffle(boxes)
        if (prisoners.every(p => cycles(cards, p))) nsuccesses += 1
    }

    return nsuccesses / simulationsteps
}

const result = _.flatMap(_.range(3, 100 + 1), nprisoners => _.range(1, nprisoners + 1).map(canopen => ({ "boxes": nprisoners, canopen, win: simulate(nprisoners, canopen) })))

console.log(JSON.stringify(result))


/*const hist = _.range(3, 100).map(n => simulate(n))

console.log(hist) */