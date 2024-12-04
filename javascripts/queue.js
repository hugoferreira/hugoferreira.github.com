/*eslint-env browser, jquery, es6*/
/*global d3*/

function summary(ns) {
    const n = ns.length
    const mean = ns.reduce((a, b) => a + b) / n
    const d = ns.reduce((a, e) => a + Math.pow(mean - e, 2), 0)
    const stdev = Math.sqrt(d / n)
    const max = ns.reduce((a, b) => Math.max(a, b))
    const min = ns.reduce((a, b) => Math.min(a, b))
    return `[${min.toFixed(2)}, ${max.toFixed(2)}] μ=${mean.toFixed(2)} σ=${stdev.toFixed(2)}`
}

function gaussian(mean = 0, variance = 1) {
    let u = 0, v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * variance + mean
}

const steps = 1000000
let samples = []
let t = 0

while (t++ < steps)
    samples.push(gaussian(5, 1)) 

summary(samples) //?


/*
const newP = 0.1        // probability of a new per tick
const workers = [[10, 2]]    // ticks it takes to process on average
const working = []
let waitTimes = []
let queue = []
let t = 0

while (t++ < steps || queue.length > 0) {
    if (t < steps && Math.random() < newP) {
        queue.unshift(t)
        // console.log(`+ ${t}: [${queue.toString()}]`)
    }

    for (const w of workers) {
        if ((queue.length > 0) && (working.length == 0)) {
            const e = queue.pop()
            working.push(e + 10)
            // console.log(`- ${t}: [${queue.toString()}] > [${e}]`)
        }
    }
} 

// waitTimes.reduce((a, b) => a + b) / waitTimes.length //?
*/