import { fetchJSON, renderProjects } from './global.js';

// Fetch the JSON file and render the projects
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);


const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');
