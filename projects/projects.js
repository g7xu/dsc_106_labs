import { fetchJSON, renderProjects, countProjects } from '../global.js';

// render the projects from the JSON file into the website
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// addomg a count of projects at the top of the page in h1 tag
const projectsHeading = document.querySelector('h1');
countProjects(projects, projectsHeading);
