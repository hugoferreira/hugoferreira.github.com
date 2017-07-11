var data = [];

function update() {
  simulation();
  clearChart();
  redraw();
}

function simulation() {
  const random = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
  const avg = (r) => r.reduce((a, b) => a+b) / r.length

  let n = 500
  let counterGuy = random(1, 100)

  Array.prototype.push.apply(data, [...Array(n).keys()].map(() => {
    let counter = 0
    let sw = false
    let steps = 0
    let mem = new Set()

    while(counter < 99) {
      steps++
      var p = random(1, 100)
      if (p == counterGuy) {
        if (sw == true) {
          counter++
          sw = false
        }
      } else {
        if (sw == false && !mem.has(p)) {
          sw = true
          mem.add(p)
        }
      }
    }

    return steps;
  }))

  console.log(`After ${n} simulations, the expected value is ${avg(data)}`)
}

function drawchart() {
  const formatCount = d3.format(",.0f");

  const svg = d3.select("#histogram").append("svg").attr("width", "100%").attr("height", "100%");
  const margin = {top: 10, right: 30, bottom: 20, left: 30};
  const width = +parseInt(svg.style("width")) - margin.left - margin.right;
  const height = +parseInt(svg.style("height")) - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
      .domain([5000, 15000])
      .rangeRound([0, width]);

  g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

  clearChart = () => {
    console.log("Clearing...");
    var bars = svg.selectAll('.bar').remove();
  }

  updateChart = () => {
    console.log("Clearing...");

    const bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(50))
        (data);

    var bars = svg.selectAll('.bar').data(bins);

    // Remove
    bars.exit().remove();

    const bar = bars.enter().append("g")
      .attr("class", "bar")
      .attr("transform", (d) => `translate(${x(d.x0)}, 0)`);

    g.selectAll(".bar")
      .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", (d) => `translate(${x(d.x0)}, 0)`)
          .append("rect")
          .attr("x", 1)
          .attr("width", x(bins[0].x1) - x(bins[0].x0) + 1)
          .attr("y", height)
          .transition()
              .duration(1000)
              .attr("height", (d) => height - y(d.length))
              .attr("y", (d) => y(d.length));
  }

  redraw = () => {
    console.log("Updating...");

    const bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(50))
        (data);

    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, (d) => d.length)])
        .range([height, 0]);

    g.selectAll(".bar")
      .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", (d) => `translate(${x(d.x0)}, 0)`)
          .append("rect")
          .attr("x", 1)
          .attr("width", x(bins[0].x1) - x(bins[0].x0) + 1)
          .attr("y", height)
          .transition()
              .duration(1000)
              .attr("height", (d) => height - y(d.length))
              .attr("y", (d) => y(d.length));
  }

  redraw();

  g.append("line")
    .attr("class", "x-marker")
    .attr("x1", x(10417.74)).attr("x2", x(10417))
    .attr("y1", 0).attr("y2", height)
}

$(() => { simulation(); drawchart(); });
