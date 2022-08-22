function colorToggle(k) {
    const string = '.toggle' + k
    const toggle = document.querySelector(string)
    fetch('http://localhost:5000/auth/items')
        .then(response => {
            return response.json()
        }).then(data => {
            if (toggle.innerHTML == '+') {
                toggle.classList.remove('btn-primary')
                toggle.classList.add('btn-success')
                toggle.innerHTML = '-'
                barData.push({ group: data[k].territory, value: data[k].violentPerPop })
                update(barData)
            } else {
                toggle.classList.remove('btn-success')
                toggle.classList.add('btn-primary')
                toggle.innerHTML = '+'
                var index = barData.findIndex(i => i.group === data[k].territory)
                barData.splice(index, 1)
                update(barData)
            }
        })
}

fetch('http://localhost:5000/auth/items')
    .then(response => {
        return response.json()
    }).then(data => {
        // Table create

        const table = document.querySelector('.table-group-divider')
        for (let i = 0; i < data.length; i++) {
            const item = '<th>' + data[i].territory + '</th><td>' + data[i].pctKidsBornNevrMarr + '</td><td>' + data[i].pctKids2Par + '</td><td>' + data[i].pctWhite + '</td><td>' + data[i].pctBlack + '</td><td>' + data[i].pctWdiv + '</td><td>' + data[i].pctPubAsst + '</td><td>' + data[i].pctAllDivorc + '</td><td>' + data[i].pctPoverty + '</td><td>' + data[i].pctVacantBoarded + '</td><td>' + data[i].pctUnemploy + '</td><th>' + data[i].violentPerPop + '</th><td><button class="btn btn-primary toggle' + i + '" onClick="colorToggle(' + i + ')">+</button></td><td><form action="/auth/remove" method="post"><button class="btn btn-danger" name="remove" value="' + data[i].id + '">X</button></form></td></tr>'
            table.insertAdjacentHTML('beforeend', item)
        }

    }).catch(err => {
        console.log('Errors: ' + err.message)
    })

// create 2 data_set
const barData = [
];

// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize the X axis
const x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);
const xAxis = svg.append("g")
    .attr("transform", `translate(0,${height})`)

// Initialize the Y axis
const y = d3.scaleLinear()
    .range([height, 0]);
const yAxis = svg.append("g")
    .attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function update(data) {

    // Update the X axis
    x.domain(data.map(d => d.group))
    xAxis.call(d3.axisBottom(x))

    // Update the Y axis
    y.domain([0, d3.max(data, d => d.value)]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create the u variable
    var u = svg.selectAll("rect")
        .data(data)

    u
        .join("rect") // Add a new rect for each new elements
        .transition()
        .duration(1000)
        .attr("x", d => x(d.group))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#563d7c")
}

// Initialize the plot with the first dataset
update(barData)

var tooltipTriggerList = [].slice.call(document.querySelectorAll('.tt'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})