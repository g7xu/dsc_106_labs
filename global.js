console.log('IT’S ALIVE!');

const ARE_WE_HOME = document.documentElement.classList.contains('home');

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contacts' },
  { url: 'resume/', title: 'Resume' },
  {url: 'https://g7xu.github.io/', title: 'actual_web'}
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;


  // checking for home page  
  if (!ARE_WE_HOME && !url.startsWith('http')) {
      url = '../' + url;
  }

  let link = document.createElement('a');
  link.href = url;
  link.textContent = title;

  // checking for highlights
  if (link.host === location.host && link.pathname === location.pathname) {
    link.classList.add('current');
  }

  if (link.host !== location.host) {
    link.target = '_blank'
  }

  nav.appendChild(link);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">auto</option>
      <option value="light">light</option>
      <option value="dark">dark</option>
    </select>
  </label>`
);

let select = document.querySelector('.color-scheme select')

select.addEventListener('input', function (event) {
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});

if ("colorScheme" in localStorage) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}

let form = document.querySelector('form')

form?.addEventListener('submit', function (event) {
  event.preventDefault();
  let data = new FormData(form);
  let url = form.action + '?';
  for (let [name, value] of data) {
    url += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
  }
  url = url.slice(0, -1); // Remove the trailing '&'
  location.href = url;
})

// asynchronous funciont that will fetch the projects data
export async function fetchJSON(url) {
  try {

      // Fetch the JSON file from the given URL
      const response = await fetch(url);

      // check if the response is valid
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      // Parse the JSON file
      const data = await response.json();
      return data;

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

// call the fetchJSON function
fetchJSON('../lib/projects.json')

// creating funciton that will dynamically create the projects page
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Create the project and article element
  containerElement.innerHTML = '';

  // populating each project in the container
  for (const project of projects) {
    const article = document.createElement('article');
    article.innerHTML = `
      <h3>${project.title}</h3>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  }
}

// function that will count the number of projects and display it in the h1 tag
export function countProjects(projects, headingElement) {
  headingElement.textContent = `Total Projects: ${projects.length}`;
}

//  function that will fetch the github data
export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);
}
