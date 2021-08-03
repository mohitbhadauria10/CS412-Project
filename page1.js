 // Define SVG Element and get width and height
  var svg = d3.select("#worldMap"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var format = d3.format(",d");

  // Parsing the dates
  var parseDate = d3.timeParse("%m/%d/%Y");
  var formatDate = d3.timeFormat("%m/%d/%Y");

  var pack = d3.pack().size([width, height]).padding(1.5);
  
  // Define World map with countries using d3 library
  var path = d3.geoPath();
  var projection = d3.geoMercator().scale(130).center([0,15]).translate([width / 2, height / 2]);
  
  // Define Color Scale to properly represent the shades of blue color
  var data = d3.map();
  var colorScale = d3.scaleThreshold().domain([1000, 10000, 100000, 300000, 1000000, 5000000]).range(d3.schemeBlues[7]);
  
// Defining Tooltip code while hovering over the countries
  var tooltip = d3.select("div")
    .append("rect")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "#00a0dc")
    .style("color", "white")
    .style("padding", "8px")
    .style("font","34px")
    .style("border-radius", "12px")
  // Read data from file and display in  the worldMap
  d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "data/world_covid19-1.csv", function(d) { data.set(d.code, +d.Confirmed); })
    .await(ready);
  
  // Function for Mouseover Event when author keep mouse over  map
  function ready(error, topo) {
  // Writing Mouseover Function - Setting styles such as opacity, stroke and finaly displaying info in tooltip
    let mouseOver = function(d) {
      d3.selectAll(".Country").transition().duration(200).style("opacity", .3)
      d3.select(this).transition().duration(200).style("opacity", 1).style("stroke", "Black")

      tooltip.transition().duration(100).style("opacity", 1);  
      tooltip.html("Confirmed Cases in - "+ d.id +" : " + d.total);
    }


  // Writing Mouseleave Function when author move over mouse from  map
    let mouseLeave = function(d) {
      tooltip.transition().duration(100).style("opacity", 0)
      d3.selectAll(".Country").transition().duration(200).style("opacity", .8)
      d3.select(this).transition().duration(200).style("stroke", "none")
    }
  
    // Drawing the Worldmap by using D3 library
    svg.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country in the world map
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        // Fill the color of each country
        .attr("fill", function (d) {
          d.total = data.get(d.id) || 0;
          return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", .8)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
      }

// Added Annotations to display Maximum COVID19 confirmed cases in various countries

      svg.append("svg:defs").append("svg:marker")
        .attr("id", "triangle")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("markerWidth", 15)
        .attr("markerHeight", 15)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style("fill", "#8600b3");
      
      svg.append("line")
        .attr("x1", 200)
        .attr("y1", 190)
        .attr("x2", 350)
        .attr("y2", 190)          
        .attr("stroke-width", 2)
        .attr("stroke", "#8600b3")
        .attr("marker-end", "url(#triangle)");
      svg.append("text")
        .attr("x", 5).attr("y", 180)
        .text("Most Confirmed Cases- (USA- 34,603,919)")
        .style("font-size", "19px")
        .attr("alignment-baseline","left")
        .attr("fill", "#8600b3");
      
      svg.append("line")
        .attr("x1", 1050)
        .attr("y1", 250)
        .attr("x2", 780)
        .attr("y2", 250)          
        .attr("stroke-width", 2)
        .attr("stroke", "#8600b3")
        .attr("marker-end", "url(#triangle)");
      svg.append("text")
        .attr("x", 845).attr("y", 245)
        .text("2nd Most Confirmed Cases- (India-31,440,951)")
        .style("font-size", "19px")
        .attr("alignment-baseline","left")
        .attr("fill", "#8600b3");

        svg.append("line")
        .attr("x1", 200)
        .attr("y1", 325)
        .attr("x2", 490)
        .attr("y2", 325)          
        .attr("stroke-width", 2)
        .attr("stroke", "#8600b3")
        .attr("marker-end", "url(#triangle)");
      svg.append("text")
        .attr("x", 15).attr("y", 320)
        .text("Third Most Confirmed Cases- (Brazil- 19,749,073)")
        .style("font-size", "19px")
        .attr("alignment-baseline","left")
        .attr("fill", "#8600b3");