fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').
then(response => response.json()).
then(responseData => {
  //DATA **********************************************************************
  //getting the data i need to create the chart
  var dateGDPres = responseData.data;
  const GDPData = dateGDPres.map(element => element[1]); //gpd values
  const numberYears = dateGDPres.map(element => parseInt(element[0].slice(0, 4)));
  const dateYearsObject = dateGDPres.map(function (item) {
    return new Date(item[0]); //mapping array and returning date objects
    /*helped by:
    https://forum.freecodecamp.org/t/10-the-data-date-attribute-and-its-corresponding-bar-element-should-align-with-the-corresponding-value-on-the-x-axis/265740
    */
  });
  const maxDateYearsObject = new Date(d3.max(dateYearsObject)); //most recent date
  const maxGDPData = Math.max.apply(Math, GDPData); //getting the greatest value

  //CHART LAYOUT ***************************************************************
  var width = 600,
  height = 300,
  barWidth = width / dateGDPres.length; //the amount of data objects divided by width

  const chartIn = d3.select(".chart").
  append("svg").
  attr('width', width + 100).
  attr('height', height + 60);

  const tooltip = d3.
  select(".chart").
  append("div").
  attr('id', 'tooltip').
  attr("class", "tooltip").
  attr("id", "tooltip").
  style('opacity', 0);

  //AXIS ***********************************************************************
  //X-AXIS
  const xScale = d3.scaleTime() //SCALE TIME FUCTION, instead of scaleLinear
  .domain([d3.min(dateYearsObject), maxDateYearsObject]) //date objects
  .range([0, width]);
  const xAxis = d3.axisBottom(xScale);

  chartIn.append('g').
  call(xAxis).
  attr('id', 'x-axis').
  attr('transform', `translate(50, ${height})`);
  //Y-AXIS
  const yScale = d3.scaleLinear().
  domain([0, maxGDPData]) //smallest,largest values of the chart;
  .range([height, 0]); //bottom | top
  var yAxis = d3.axisLeft(yScale);

  chartIn.append('g').
  call(yAxis).
  attr('id', 'y-axis').
  attr('transform', `translate(50, ${0})`); //modified this

  //CHART PLOTTING ****************************************************************
  const svg = chartIn.
  selectAll("svg").
  data(dateGDPres).
  enter().
  append("rect").
  attr("class", "bar").
  attr("width", barWidth).
  attr('transform', `translate(51, 0)`).
  attr("height", d => d[1] / 60) //idk why 60
  .attr("data-date", d => d[0]).
  attr("data-gdp", d => d[1]).
  attr("x", (d, i) => i * 2.18) //idk why 2.18
  .attr("y", (d, i) => height - d[1] / 60) //whenever i need to change the scale Both y and height have to be changed in order to not modify the data
  //cool i think thats gonna work now!
  //EVENTS
  .on("mouseover", function (d, i) {//hover
    tooltip.
    transition().
    duration(200).
    style('opacity', 0.9);
    tooltip.html(
    `result: ${[i][0][1]}`).

    attr('data-date', [i][0][0]);
  }).
  on("mouseout", function (d) {//mouseout
    tooltip.
    transition().
    duration(200).
    style("opacity", 0);
  });
});