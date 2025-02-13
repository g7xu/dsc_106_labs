import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// read in the information from the csv file
let data = [];
let commits = [];

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
      }));
    
}

function processCommits() {
  commits = d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: 'https://github.com/CellMaker_DataParser/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        writable: true, // Allows the value to be changed
        enumerable: false, // Hides the property from enumeration
        configurable: true // Allows the property descriptor to be changed and the property to be deleted
      });

      return ret;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();

  processCommits();
  console.log(commits);
});



