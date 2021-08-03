// Code for Defining SVG Canvas
// set the dimensions and margins for didplaying the bar chart
var margin = {top: 10, right: 100, bottom: 90, left: 100},
    width = 1600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// appending the SVG object with width and height
var svg = d3.select("#stateBarGraph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


 var format = d3.format(",d");

  // Parsing the dates
  var parseDate = d3.timeParse("%m/%d/%Y");
  var formatDate = d3.timeFormat("%m/%d/%Y");

  var pack = d3.pack().size([width, height]).padding(1.5);   

// Define update function after Month button click

function update(stateVar) {
 // Read data from file - State_Confirmed-1.csv to display Confirmed Cases
d3.csv("data/State_Confirmed-1.csv", function(data) {

 // Create Pointer to show confirmed Cases and fill with Blue Color
svg.append("rect").attr("width",20).attr("height",20).attr("x", 40).attr("y", -10).style("fill", "#00a0dc")
svg.append("text").attr("x", 70).attr("y", 0).text("Confirmed Cases Statewise").style("font-size", "17px").attr("alignment-baseline","middle")

// Creation of Axis --  Adding X axis as States of USA
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.Code; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

//Adding Y axis as No of COVID Infections
var y = d3.scaleLinear()
  .domain([0, 4000000])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Define tooltip to show confirmed cases
// Defining Tooltip code while hovering over the countries

var tooltip = d3.select("div")
    .append("rect")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "#00a0dc")
    .style("color", "white")
    .style("border-radius", "12px")
    .style("padding", "8px")
    .style("font","34px")
    .style("border-radius", "12px")

// Writing MouseOver Function
 // Writing MouseOver Function when author move over mouse from  map
var mouseover = function(d) {
  tooltip
      .transition()
      .duration(100)
      .style("opacity", 1)  
  tooltip
    .html(d.Code +"- Confirmed Cases: " + d[stateVar])
      

  }
  // Writing MouseMove Function
   // Writing MouseMove Function when author move out mouse from  map
var mousemove = function(d) {
    tooltip
      .html(d.Code +"- Confirmed Cases: " + d[stateVar])
      
  }
  // Writing Mouseout Function
   // Writing Mouseleave Function when author move over mouse from  map
  var mouseout = function(d) {
    tooltip
      .transition()
      .duration(100)
      .style("opacity", 0)
  }


// Function to update data when user select a month
var updateVar = svg.selectAll("rect")
      .data(data)
updateVar
  .enter()
  .append("rect")
  .merge(updateVar)
    .attr("x", function(d) { return x(d.Code); })
    .attr("y", function(d) { return y(d[stateVar]); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d[stateVar]); })
    .attr("fill", "#00a0dc")
    .on('mouseover', mouseover)
  .on('mousemove', mousemove)
  .on('mouseout', mouseout);


})
}
// By Default fill December Month Data
update('December')