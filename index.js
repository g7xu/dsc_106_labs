import { fetchJSON, renderProjects, fetchGitHubData} from './global.js';

// Fetch the JSON file and render the projects
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);

// Render the projects
const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');

// fetch data from github
const githubData = await fetchGitHubData('g7xu');
const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
    profileStats.innerHTML = `
          <dl style="display: grid; grid-template-columns: repeat(4, 1fr);">
            <dt style="grid-row: 1;">Public Repos:</dt><dd style="grid-row: 2;">${githubData.public_repos}</dd>
            <dt style="grid-row: 1;">Public Gists:</dt><dd style="grid-row: 2;">${githubData.public_gists}</dd>
            <dt style="grid-row: 1;">Followers:</dt><dd style="grid-row: 2;">${githubData.followers}</dd>
            <dt style="grid-row: 1;">Following:</dt><dd style="grid-row: 2;">${githubData.following}</dd>
          </dl>
      `;
  }