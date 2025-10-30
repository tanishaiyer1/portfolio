import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let svg = d3.select("#projects-pie-plot");

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let arc = arcGenerator({
  startAngle: 0,
  endAngle: 2 * Math.PI,
});

d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

