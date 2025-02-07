import { fetchJSON, renderProjects, countProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";


// render the projects from the JSON file into the website
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// addomg a count of projects at the top of the page in h1 tag
const projectsHeading = document.querySelector('h1');
countProjects(projects, projectsHeading);



// adding a search field in the website
let query = '';
let year = '';
let searchInput = document.querySelector('.searchBar');


// creating a pie chart using d3
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
// render the inital pie chart
renderPlot(projects);


// function that will render the pie chart and legend
function renderPlot(filteredProjects) {

    // calculating project years and adding it to the page
    let rolledData = d3.rollups(
        filteredProjects,
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

    // highlight the selected pie slice with color on-click
    let selectedIndex = -1;
    let svg = d3.select('svg');
    svg.selectAll('path').remove();
    arcs.forEach((arc, i) => {
        svg
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(i))
        .on('click', () => {
            // if selectedIndex is already selected, deselect it
            selectedIndex = selectedIndex === i ? -1 : i;
            
            // if selectedIndex is already selected, set year to empty string
            // otherwise, set year to the selected year
            year = selectedIndex === -1 ? '' : data[selectedIndex].label;
            
            svg
            .selectAll('path')
            .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : ''
            ));

            legend
            .selectAll('li')
            .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : ''
            ));

            // Filter out information by years and search query
            let filteredProjectsByYear = filteredProjects;
            if (selectedIndex !== -1) {
                let selectedYear = data[selectedIndex].label;
                filteredProjectsByYear = filteredProjects.filter((project) => {
                    return project.year === selectedYear;
                });
            }

            // Apply search query filter
            let finalFilteredProjects = filteredProjectsByYear.filter((project) => {
                let values = Object.values(project).join('\n').toLowerCase();
                return values.includes(query.toLowerCase());
            });

            renderProjects(finalFilteredProjects, projectsContainer, 'h2');
        });
    });
}



if (searchInput) {
  searchInput.addEventListener('change', (event) => {
    // clear the projects container and the legend
    projectsContainer.innerHTML = '';
    d3.select('.legend').selectAll('li').remove();

    // update query value
    query = event.target.value;
    // TODO: filter the projects based on the search query and year
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
        });
    
    // filter the projects based on the year
    if (year !== '') {
        filteredProjects = filteredProjects.filter((project) => {
            return project.year === year;
        });
    }
    // TODO: render updated projects!
    renderProjects(filteredProjects, projectsContainer, 'h2');

    // render the pie chart
    renderPlot(filteredProjects);

    // reset the year
    year = '';

    });
}

