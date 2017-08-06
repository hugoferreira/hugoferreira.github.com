// ------------------------------------------
//  Global Stuff
// ------------------------------------------
const random = () => (Math.random() * 2 - 1)
let data = []
let distance = []
let updateChart
let updateHistogram

// ------------------------------------------
//  Hit map
// ------------------------------------------
function drawHitMap() {
    const svg = d3.select("#hitmap").append("svg")
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const width = +parseInt(svg.style("width")) - margin.left - margin.right;
    const height = +parseInt(svg.style("height")) - margin.top - margin.bottom;
    const edge = Math.min(width, height);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("circle")
        .attr("class", "border")
        .attr("r", edge / 2)
        .attr("transform", `translate(${edge / 2},${edge / 2})`);

    g.append("circle")
        .attr("class", "outer-circle")
        .attr("r", edge * 0.4)
        .attr("transform", `translate(${edge / 2},${edge / 2})`);

    const x = d3.scaleLinear().domain([-1, 1]).range([0, edge]);
    const y = d3.scaleLinear().domain([-1, 1]).range([edge, 0]);

    g.append("g").attr("class", "axis")
        .attr("transform", 'translate(-10,0)')
        .call(d3.axisLeft(y));

    g.append("g").attr("class", "axis")
        .attr("transform", `translate(0,${height - 10})`)
        .call(d3.axisBottom(x));

    updateChart = () => {
        console.log("Updating...");

        g.selectAll(".point")
            .data(data)
            .enter().append("g")
            .attr("class", (d) => ((d[0] ** 2 + d[1] ** 2) <= 1) ? 'point highlighted' : 'point normal')
            .attr("transform", (d) => `translate(${x(d[0])}, ${y(d[1])})`)
            .append("circle").attr("r", 0).transition().duration(500).attr("r", 4);
    }

    updateChart();
}

// ------------------------------------------
//  Histogram
// ------------------------------------------

function drawHistogram() {
    const formatCount = d3.format(",.0f");

    const svg = d3.select("#histogram").append("svg")
    const margin = { top: 20, right: 30, bottom: 30, left: 30 };
    const width = +parseInt(svg.style("width")) - margin.left - margin.right;
    const height = +parseInt(svg.style("height")) - margin.top - margin.bottom;

    const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 1]).range([0, width]);

    chart.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    clearChart = () => { svg.selectAll('.bar').remove(); }

    updateHistogram = () => {
        const bins = d3.histogram()
            .domain(x.domain())
            .thresholds(x.ticks(10))
            (distance);

        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height, 0]);

        const bars = chart.selectAll('.bar').data(bins);

        // bars.exit().remove();
        bars.enter().append("g")
            .attr("class", "bar")
            .attr("transform", d => `translate(${Math.ceil(x(d.x0))}, -2)`)
            .append("rect")
            .attr("x", 0)
            .attr("width", Math.floor(x(bins[0].x1) - x(bins[0].x0)))
            .attr("y", height)
            .transition()
            .duration(500)
            .attr("height", d => height - y(d.length))
            .attr("y", d => y(d.length));

        bars.select("rect")
            .transition()
            .duration(500)
            .attr("height", d => height - y(d.length))
            .attr("y", d => y(d.length));
    }

    updateHistogram();
}

// ------------------------------------------
//  Simulation
// ------------------------------------------

function updateStatistics() {
    const inside = distance.filter(d => d <= 1)
    const ring = inside.filter(d => d >= 0.8)
    const ratio = inside.length / data.length
    const rratio = ring.length / data.length
    const earea = ratio * 4

    $('#statistics #ratio').html((ratio * 100).toPrecision(4))
    $('#statistics #estimated-area').html(earea.toPrecision(4))
    $('#statistics #outer-ring').html((rratio * 100).toPrecision(2))
}

function simulate(n = 100) {
    Array.prototype.push.apply(data, [...Array(n).keys()].map(() => [random(), random()]))
    distance = data.map(d => Math.sqrt(d[0] ** 2 + d[1] ** 2))
    updateChart()
    updateHistogram()
    updateStatistics()
}

$(document).ready(() => {
    drawHitMap();
    drawHistogram();
});
