var unsort_ships,unsort_svg,unsort_x,unsort_y;
function loadBars()
{
// set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

// set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = d3.select("#bar_chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// get the data
    var ships = [];

    d3.csv("csv/data_mod.csv", function (error, data) {
        if (error) throw error;

        var car_map = new Map();

        data.forEach(function (d) {
            var cnt = car_map.get(d.country);
            if (cnt == undefined)
                cnt = 1;
            else
                cnt += 1;
            car_map.set(d.country, cnt);
        });
        var iterator = car_map.keys();
        console.log(car_map.size);
        for (var i = 0; i < car_map.size; i++) {
            var key = iterator.next().value;
            ships.push({"country": key, "value": +car_map.get(key)})
        }

        // Scale the range of the data in the domains
        x.domain(ships.map(function (d) {
            return d.country;
        }));
        y.domain([0, d3.max(ships, function (d) {
            return d.value;
        })]);

        // append the rectangles for the bar chart
        var bars = svg.selectAll(".bar")
            .data(ships)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d) {
                return "translate(" + x(d.country) + ", " + y(d.value) + ")";
            })


        bars.append("rect")
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .on("mouseover", function (d, i) {
                d3.select(this).style("fill", "green");
                d3.select("#bar" + i).style("visibility", "visible");
            })
            .on("mouseleave", function (d, i) {
                d3.select(this).style("fill", "steelblue");
                d3.select("#bar" + i).style("visibility", "hidden");
            });

        bars.append("text")
            .style("text-anchor", "end")
            .attr("id", function (d, i) {
                return "bar" + i;
            })
            .attr("dx", "-.1em")
            .attr("dy", "1.5em")
            .attr("transform", "rotate(-90)")
            .text(function (d) {
                return d.value;
            })
            .style("stroke", "white")
            .style("opacity", 1)
            .style("visibility", "hidden");

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("id", "xAxis")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.50em")
            .attr("transform", "rotate(-90)");

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        var unsort_ships = ships;
        var unsort_svg = svg;
        var unsort_x = x;
        var unsort_y = y;
        var sorted=0;
        sortBars(ships,svg,x,y);
        drawBars(unsort_ships,unsort_svg,unsort_x,unsort_y);
    });
}

function sortBars(ships,x,y){

    var x0 = x.domain(ships.sort(function(a, b) { return b.value - a.value;})
        .map(function(d) { return d.country; }))
        .copy();

    var svg = d3.select("#bar_chart");

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.country) - x0(b.country); });
    svg.selectAll(".bar")
        .transition()
        .delay(500)
        .attr("transform", function(d){
            return "translate("  + x0(d.country) + ", " +  y(d.value) + ")";});
    svg.select("#xAxis")
        .call(d3.axisBottom(x0))
};


function drawBars(ships,x,y){


    var x0 = x;
    var svg = d3.select("#bar_chart")

    svg.selectAll(".bar")
        .transition()
        .delay(500)
        .attr("transform", function(d){
            return "translate("  + x0(d.country) + ", " +  y(d.value) + ")";});
    svg.select("#xAxis")
        .call(d3.axisBottom(x0))
};

loadBarsSum();
//sortBars(ships,svg,x,y);

function loadBarsSum()
{
// set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        //width = 960 - margin.left - margin.right,
        width = 600 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

// set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = d3.select("#bar_chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// get the data
    var ships = [];

    d3.csv("csv/country.ships.count.csv", function (error, data) {
        if (error) throw error;

        var car_map = new Map();

        data.forEach(function (d) {
            var cnt = car_map.get(d.country);
            if (cnt == undefined)
                cnt = 0;
            else
                console.log(d.count)
                cnt += +d.count;
            car_map.set(d.country, cnt);
        });
        var iterator = car_map.keys();

        for (var i = 0; i < car_map.size; i++) {
            var key = iterator.next().value;
            ships.push({"country": key, "value": +car_map.get(key)})
        }

        // Scale the range of the data in the domains
        x.domain(ships.map(function (d) {
            return d.country;
        }));
        y.domain([0, d3.max(ships, function (d) {
            return d.value;
        })]);

        // append the rectangles for the bar chart
        var bars = svg.selectAll(".bar")
            .data(ships)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d) {
                return "translate(" + x(d.country) + ", " + y(d.value) + ")";
            })


        bars.append("rect")
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .on("mouseover", function (d, i) {
                d3.select(this).style("fill", "green");
                d3.select("#bar" + i).style("visibility", "visible");
            })
            .on("mouseleave", function (d, i) {
                d3.select(this).style("fill", "steelblue");
                d3.select("#bar" + i).style("visibility", "hidden");
            });

        bars.append("text")
            .style("text-anchor", "end")
            .attr("id", function (d, i) {
                return "bar" + i;
            })
            .attr("dx", "-.1em")
            .attr("dy", "1.5em")
            .attr("transform", "rotate(-90)")
            .text(function (d) {
                return d.value;
            })
            .style("stroke", "white")
            .style("opacity", 1)
            .style("visibility", "hidden");

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("id", "xAxis")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.50em")
            .attr("transform", "rotate(-90)");

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        var unsort_ships = ships;
        var unsort_svg = svg;
        var unsort_x = x;
        var unsort_y = y;
        var sorted=0;
        //sortBars(ships,svg,x,y);
        sortBars(ships,x,y);
        //drawBars(unsort_ships,unsort_svg,unsort_x,unsort_y);
    });
}