const margin = { top: 80, right: 60, bottom: 60, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
// The margin code above
let allData = []
//let xVar, yVar, sizeVar, targetYear
let xScale, yScale, sizeScale

let xVar = 'income', yVar = 'lifeExp', sizeVar = 'population', targetYear = 2000;
function init(){
  d3.csv("./data/gapminder_subset.csv", 
    function(d){
    return {  
    // Besides converting the types, we also simpilify the variable names here. 
    country: d.country,
    continent: d.continent,
    year: +d.year, // using + to convert to numbers; same below
    lifeExp: +d.life_expectancy, 
    income: +d.income_per_person, 
    gdp: +d.gdp_per_capita, 
    childDeaths: +d.number_of_child_deaths,
    // Your turn: 
    // convert d.population, and assign it to population
    population: +d.population
    }})
  .then(data => {
          console.log(data)
          allData = data
          setupSelector()
          
          // Initial rendering steps:
          // P.S. You could move these into setupSelector(), 
          // but calling them separately makes the flow clearer.
          updateAxes()
          updateVis()
          addLegend()
      })
  .catch(error => console.error('Error loading data:', error));
}



// Here’s what each function is responsible for:
const options = ['income', 'lifeExp', 'gdp', 'population', 'childDeaths']
function setupSelector(){
  // Handles UI changes (sliders, dropdowns)
  // Anytime the user tweaks something, this function reacts.
  // May need to call updateAxes() and updateVis() here when needed!
  let slider = d3
  .sliderHorizontal()
  .min(d3.min(allData.map(d => +d.year))) // setup the range
  .max(d3.max(allData.map(d => +d.year))) // setup the range
  .step(1)
  .width(width)  // Widen the slider if needed
  .displayValue(false)
  .on('onchange', (val) => {
      d3.select('#value').text(val);
      targetYear = +val // Update the year
      updateVis() // Refresh the chart
  });
  d3.select('#xVariable').property('value', xVar)
  d3.select('#yVariable').property('value', yVar)
  d3.select('#sizeVariable').property('value', sizeVar)
  d3.selectAll('.variable')
   // loop over each dropdown button
    .each(function() {
        d3.select(this).selectAll('myOptions')
        .data(options)
        .enter()
        .append('option')
        .text(d => d) // The displayed text
        .attr("value",d => d) // The actual value used in the code
    })
    .on("change", function (event) {
      
      xVar= d3.select('#xVariable').property('value')
      yVar=d3.select('#yVariable').property('value')
      sizeVar = d3.select('#sizeVariable').property('value')
      // svg.selectAll('.axis').remove()
      // svg.selectAll('.labels').remove()
      updateAxes(); 
      updateVis();
  })



  d3.select('#slider')
  .append('svg')
  .attr('width', width+50)  // Adjust width if needed
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)')
  .call(slider);
}

function updateAxes(){
  // Draws the x-axis and y-axis
  // Adds ticks, labels, and makes sure everything lines up nicely
  svg.selectAll('.axis').remove()
  svg.selectAll('.labels').remove()
  xScale = d3.scaleLinear()
  .domain([0, d3.max(allData, d => d[xVar])])
  .range([0, width]);
  const xAxis = d3.axisBottom(xScale)

  svg.append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0,${height})`) // Position at the bottom
  .call(xAxis);

  yScale = d3.scaleLinear()
  .domain([0, d3.max(allData, d => d[yVar])])
  .range([height, 0]);
  const yAxis = d3.axisLeft(yScale)

  svg.append('g')
  .attr('class', 'axis')
  .call(yAxis);

  sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(allData, d => d[sizeVar])]) // Largest bubble = largest data point 
    .range([5, 20]); // Feel free to tweak these values if you want bigger or smaller bubbles


  // X-axis label
  svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom - 20)
  .attr("text-anchor", "middle")
  .text(xVar) // Displays the current x-axis variable
  .attr('class', 'labels')

  // Y-axis label (rotated)
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -margin.left + 40)
  .attr("text-anchor", "middle")
  .text(yVar) // Displays the current y-axis variable
  .attr('class', 'labels')
}

const continents = ['Africa', 'Asia', 'Oceania', 'Americas', 'Europe']
const colorScale = d3.scaleOrdinal(continents, d3.schemeSet2); // d3.schemeSet2 is a set of predefined colors. 
const t = 1000; // 1000ms = 1 second
function updateVis(){
 // svg.selectAll('.points').remove()
// Draws (or updates) the bubbles
// Filter data for the current year
  let currentData = allData.filter(d => d.year === targetYear)
  svg.selectAll('.points')
  .data(currentData, d => d.country)
  .join(
      // When we have new data points
      function(enter){
          return enter
          .append('circle')
          .attr('class', 'points')
          .style('fill', d => colorScale(d.continent))  // Default color for now
          .style('opacity', .5)
          .attr('cx', d => xScale(d[xVar])) // Position on x-axis
          .attr('cy', d => yScale(d[yVar])) // Position on y-axis
          .on('mouseover', function (event, d) {
            // console.log(d) // See the data point in the console for debugging
            d3.select(this) // Refers to the hovered circle
            .style('stroke', 'black')
            .style('stroke-width', '2px')
            d3.select('#tooltip')
                 // if you change opacity to hide it, you should also change opacity here
                .style("display", 'block') // Make the tooltip visible
                .html( // Change the html content of the <div> directly
                `<strong>${d.country}</strong><br/>
                Continent: ${d.continent}`)
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (event, d) {
            d3.select('#tooltip')
              .style('display', 'none') // Hide tooltip when cursor leaves
            d3.select(this) // Refers to the hovered circle
              .style('stroke', 'black')
              .style('stroke-width', '0px')
        })
          .transition(t)
          .attr('r',  d => sizeScale(d[sizeVar])) // Bubble size
          
          
        },
      // Update existing points when data changes
      function(update){
          return update
          .transition(t)
          .attr('cx', d => xScale(d[xVar]))
          .attr('cy', d => yScale(d[yVar]))
          .attr('r',  d => sizeScale(d[sizeVar]))
      },
      // Remove points that no longer exist in the filtered data 
      function(exit){
        exit
                .transition(t)
                .attr('r', 0)  // Shrink to radius 0
                .remove()
      }
  )
}

function addLegend(){
  let size = 10;  // Size of the legend squares

  // Append squares for each continent
  svg.selectAll('continentSquare')
    .data(continents)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (size + 100) + 100)  // Position horizontally
    .attr("y", -margin.top / 2) // Position above the chart
    .attr("width", size)
    .attr("height", size)
    .style("fill", d => colorScale(d));

  // Append text labels next to each square
  svg.selectAll("continentName")
    .data(continents)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * (size + 100) + 120)  
    .attr("y", -margin.top / 2 + size) // Align vertically with the square
    .style("fill", d => colorScale(d))  // Match text color to the square
    .text(d => d) // The actual continent name
    .attr("text-anchor", "left")
    .style('font-size', '13px');
}

window.addEventListener('load', init);


// Create SVG
const svg = d3.select('#vis')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);




 