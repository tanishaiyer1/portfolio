// import { fetchJSON, renderProjects } from '../global.js';
// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// let selectedIndex = -1;
// let query = '';

// const projects = await fetchJSON('../lib/projects.json');
// const projectsContainer = document.querySelector('.projects');
// const searchInput = document.querySelector('.searchBar');
// const svg = d3.select('#projects-pie-plot');
// const legend = d3.select('.legend');

// renderProjects(projects, projectsContainer, 'h2');
// renderPieChart(projects);

// searchInput.addEventListener('input', (event) => {
//   query = event.target.value;

//   let filteredProjects = projects.filter((project) => {
//     let values = Object.values(project).join('\n').toLowerCase();
//     return values.includes(query.toLowerCase());
//   });

//   renderProjects(filteredProjects, projectsContainer, 'h2');
//   renderPieChart(filteredProjects);
// });

// function renderPieChart(projectsGiven) {
//   svg.selectAll('*').remove();
//   legend.selectAll('*').remove();

//   let rolledData = d3.rollups(
//     projectsGiven,
//     (v) => v.length,
//     (d) => d.year,
//   );

//   let data = rolledData.map(([year, count]) => ({
//     value: count,
//     label: year
//   }));

//   let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
//   let colors = d3.scaleOrdinal(d3.schemeTableau10);
//   let sliceGenerator = d3.pie().value((d) => d.value);
//   let arcData = sliceGenerator(data);
//   let arcs = arcData.map((d) => arcGenerator(d));

//   arcs.forEach((arc, idx) => {
//     svg.append('path')
//       .attr('d', arc)
//       .attr('fill', colors(idx))
//       .attr('class', selectedIndex === idx ? 'selected' : null)
//       .style('cursor', 'pointer')
//       .on('click', () => {
//         selectedIndex = selectedIndex === idx ? -1 : idx;

//         let filtered = selectedIndex === -1
//             ? projects
//             : projects.filter((p) => p.year === data[selectedIndex].label);

//         renderProjects(filtered, projectsContainer, 'h2');
//         renderPieChart(projects);
//         });
//       });

//   data.forEach((d, idx) => {
//     legend.append('li')
//       .attr('style', `--color:${colors(idx)}`)
//       .attr('class', selectedIndex === idx ? 'legend-item selected' : 'legend-item')
//       .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
//       .style('cursor', 'pointer')
//       .on('click', () => {
//         selectedIndex = selectedIndex === idx ? -1 : idx;

//         let filtered = selectedIndex === -1
//             ? projects
//             : projects.filter((p) => p.year === data[selectedIndex].label);

//         renderProjects(filtered, projectsContainer, 'h2');
//         renderPieChart(projects);
//         });
//   });
// }

import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let selectedIndex = -1;
let query = '';
let currentPieData = [];

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');
const svg = d3.select('#projects-pie-plot');
const legend = d3.select('.legend');

function getFilteredProjects(projectsGiven, query, selectedIndex, dataArray) {
  return projectsGiven.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    let matchesSearch = values.includes(query.toLowerCase());
    let matchesPie = (selectedIndex === -1) || String(project.year) === String(dataArray[selectedIndex]?.label);
    return matchesSearch && matchesPie;
  });
}

renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  let filteredProjects = getFilteredProjects(projects, query, selectedIndex, currentPieData);
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

function renderPieChart(projectsGiven) {
  svg.selectAll('*').remove();
  legend.selectAll('*').remove();

  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );
  let data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));
  currentPieData = data; 

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  let sliceGenerator = d3.pie().value(d => d.value);
  let arcData = sliceGenerator(data);

  arcData.forEach((d, idx) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(idx))
      .attr('class', selectedIndex === idx ? 'selected' : null)
      .style('cursor', 'pointer')
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        svg.selectAll('path')
          .attr('class', (_, i) => selectedIndex === i ? 'selected' : null);
        legend.selectAll('li')
          .attr('class', (_, i) => selectedIndex === i ? 'legend-item selected' : 'legend-item');

        let filtered = getFilteredProjects(projects, query, selectedIndex, data);
        renderProjects(filtered, projectsContainer, 'h2');
        renderPieChart(projects); 
      });
  });

  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', selectedIndex === idx ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .style('cursor', 'pointer')
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        svg.selectAll('path')
          .attr('class', (_, i) => selectedIndex === i ? 'selected' : null);
        legend.selectAll('li')
          .attr('class', (_, i) => selectedIndex === i ? 'legend-item selected' : 'legend-item');

        let filtered = getFilteredProjects(projects, query, selectedIndex, data);
        renderProjects(filtered, projectsContainer, 'h2');
        renderPieChart(projects); 
      });
  });
}
