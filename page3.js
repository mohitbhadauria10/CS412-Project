// Defining dimensions of SVG element to draw USA Confirmed and death cases Map
var margin = {top: 10, right: 400, bottom: 90, left: 400},
    width = 1600 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// appending the SVG object with width and height
var svg = d3.select("#usa_trend")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var format = d3.format(",d");
  // Parsing the dates
  var parseDate = d3.timeParse("%m/%d/%Y");
  var formatDate = d3.timeFormat("%m/%d/%Y");

  var pack = d3.pack().size([width, height]).padding(1.5);

// Read data from CSV file and display in  the mouseover
d3.csv("data/US_Confirmed_Death_cases-1.csv", function(d) {
    return { date : d3.timeParse("%m/%d/%Y")(d.date), value : d.Confirmed, value2 : d.Death }
},


// Defining Mouseover Circle 
function(data) {

svg.append("circle").attr("cx",50).attr("cy",50).attr("r", 6).style("fill", "#00a0dc")
svg.append("circle").attr("cx",50).attr("cy",80).attr("r", 6).style("fill", "#dd5143")
svg.append("text").attr("x", 70).attr("y", 50).text("Trend Confirmed Cases in US").style("font-size", "19px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 70).attr("y", 80).text("Trend Death Cases in US").style("font-size", "19px").attr("alignment-baseline","middle")

// Adding X Axis as date format as Year and Month
var x = d3.scaleTime().domain(d3.extent(data, function(d) { return d.date; })).range([ 0, width ]);
// Appending X axis date in SVG Canvas
svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

// Adding Y axis as Numbers 
var y = d3.scaleLinear().domain([0, d3.max(data, function(d) { return +d.value; })]).range([height,0]);
// Appending Y axis numbers in SVG Canvas
svg.append("g").call(d3.axisLeft(y));

// Function to find the closest X index of the mouse:
var bisect = d3.bisector(function(d) { return d.date; }).left;
var focus = svg
  .append('g')
  .append('circle')
  .style("fill", "#00a0dc")
  .attr('r', 9.0)
  .style("opacity", 0)
var focus2 = svg
  .append('g')
  .append('circle')
  .style("fill", "#dd5143")
  .attr('r', 9.0)
  .style("opacity", 0)    

var focusText = svg
  .append('g')
  .append('text')
    .style("fill", "black")
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
var focusText2 = svg
  .append('g')
  .append('text')
    .style("fill", "#00a0dc")
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
var focusText3 = svg
  .append('g')
  .append('text')
    .style("fill", "#dd5143")
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")

// Defining the X AXis and Y Axis
svg.append("path")
  .datum(data)
  .attr("id","line1")
  .attr("fill", "none")
  .attr("stroke", "#00a0dc")
  .attr("stroke-width", 5.0)
  .attr("d", d3.line()
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.value) })
    )
svg.append("path")
  .datum(data)
  .attr("id","line2")
  .attr("fill", "none")
  .attr("stroke", "#dd5143")
  .attr("stroke-width", 5.0)
  .attr("d", d3.line()
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.value2) })
    )

// Defiing a Rectangle Element
svg
  .append('rect')
  .style("fill", "none")
  .style("pointer-events", "all")
  .attr('width', width)
  .attr('height', height)
  .on('mouseover', mouseover)
  .on('mousemove', mousemove)
  .on('mouseout', mouseout);

// Defiing a Mouseover Element
function mouseover() {
  focusText.style("opacity",1)
  focus.style("opacity", 1)
  focusText2.style("opacity",1)
  focusText3.style("opacity",1)
  focus2.style("opacity", 1)
}

// Writing MouseMove Function to display Confirmed Cases, Deaths and Reporting Date
function mousemove() {
  
  var x0 = x.invert(d3.mouse(this)[0]);
  var i = bisect(data, x0, 1);
  selectedData = data[i]
  focus
    .attr("cx", x(selectedData.date))
    .attr("cy", y(selectedData.value))
  focus2
    .attr("cx", x(selectedData.date))
    .attr("cy", y(selectedData.value2))
focusText
    .html("Reporting Date: "+selectedData.date)
    .attr("x", x(selectedData.date))
    .attr("y", y(selectedData.value)-60)

focusText2
    .html("Total Confirmed Cases: " + selectedData.value)
    .attr("x", x(selectedData.date))
    .attr("y", y(selectedData.value)-40)

focusText3
    .html("Total Death Cases: " + selectedData.value2)
    .attr("x", x(selectedData.date))
    .attr("y", y(selectedData.value)-20)
}

function mouseout() {
  focus.style("opacity", 0)
  focusText.style("opacity", 0)
}

// Added Annotations to display Maximum COVID19 confirmed cases in various countries
svg.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 6)
    .attr("refY", 6)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 12 6 0 12 3 6")
    .style("fill", "#8600b3");
svg.append("line")
  .attr("x1", 350)
  .attr("y1", 215)
  .attr("x2", 410)
  .attr("y2", 390)          
  .attr("stroke-width", 2)
  .attr("stroke", "#8600b3")
  .attr("marker-end", "url(#triangle)");
svg.append("text")
    .attr("x", 20).attr("y", 210)
    .text("Covid Second Wave (November 2020) Cases Significantly increased")
    .style("font-size", "19px")
    .attr("alignment-baseline","left")
    .attr("fill", "#8600b3");
    
svg.append("line")
  .attr("x1", 200)
  .attr("y1", 295)
  .attr("x2", 220)
  .attr("y2", 500)          
  .attr("stroke-width", 2)
  .attr("stroke", "#8600b3")
  .attr("marker-end", "url(#triangle)");
svg.append("text")
    .attr("x", 20).attr("y", 290)
    .text("Covid First Wave (June 2020) Cases Significantly increased")
    .style("font-size", "19px")
    .attr("alignment-baseline","left")
    .attr("fill", "#8600b3");
    
svg.append("line")
  .attr("x1", 500)
  .attr("y1", 50)
  .attr("x2", 550)
  .attr("y2", 105)          
  .attr("stroke-width", 2)
  .attr("stroke", "#8600b3")
  .attr("marker-end", "url(#triangle)");
svg.append("text")
    .attr("x", 400).attr("y", 45)
    .text("Vaccination Kicked in (February 2021) Cases Decreased")
    .style("font-size", "19px")
    .attr("alignment-baseline","left")
    .attr("fill", "#00b33c");
})