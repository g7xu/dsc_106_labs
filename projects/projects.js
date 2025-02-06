import { fetchJSON, renderProjects, countProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";


// render the projects from the JSON file into the website
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// addomg a count of projects at the top of the page in h1 tag
const projectsHeading = document.querySelector('h1');
countProjects(projects, projectsHeading);

// creating a pie chart using d3
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
  });

// calculating project years and adding it to the page
let rolledData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year,
)
let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
let colors = d3.scaleOrdinal(d3.schemeTableau10);

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
})

// creating legend
let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
})

// adding a search field in the website
let query = '';
let searchInput = document.querySelector('.searchBar');

if (searchInput) {
  searchInput.addEventListener('change', (event) => {
      // update query value
      query = event.target.value;
      // TODO: filter the projects
      let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
      });

      // TODO: render updated projects!
      renderProjects(filteredProjects, projectsContainer, 'h2');
    
    });
}