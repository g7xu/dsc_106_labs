console.log('IT’S ALIVE!');

// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }

// const navLinks = Array.from(document.querySelectorAll("nav a"));

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// if (currentLink) {
//   currentLink.classList.add("current");
// }

// console.log(navLinks)

// console.log(currentLink)
const ARE_WE_HOME = document.documentElement.classList.contains('home');

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contacts' },
  { url: 'resume.html', title: 'Resume' },
  {url: 'https://g7xu.github.io/', title: 'actual_web'}
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;


  // checking for home page  
  if (!ARE_WE_HOME && !url.startsWith('http')) {
    if (location.pathname !== '/dsc_106_labs/resume.html') {
      url = '../' + url;
    }
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