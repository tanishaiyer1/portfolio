import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let svg = d3.select("#projects-pie-plot");

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let data = [1, 2];
let colors = ['gold', 'purple'];

let sliceGenerator = d3.pie();
let arcData = sliceGenerator(data);

let arcs = arcData.map((d) => arcGenerator(d));

arcs.forEach((arc, idx) => {
  svg.append('path')
    .attr('d', arc)
    .attr('fill', colors[idx]);
});

// d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

