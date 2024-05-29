import './style.css';

import sparqlLogo from './assets/logo-sparql.png';
import { executeSparqlQuery, QUERY_MODEL } from './query-sparql.tsx';
import { generationOptions, generationWdt } from './filters/pokemon-generation.tsx';
import { typeOptions } from './filters/pokemon-type.tsx';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>SPARQL Query Interface</h1>
    <h2>Website to consult the Pokemon World</h2>
    <img src="${sparqlLogo}" class="logo" alt="SparQL logo" />
    
    <div id="query-container">
      <textarea id="query" placeholder="Enter your SPARQL query here">${QUERY_MODEL}</textarea>
    
      <div id="select-container">
        <span>Elige una generación de Pokemon</span>
        <select id="generation-select">
          ${generationOptions}
        </select>
        
        <span>Elige uno o varios tipos de Pokemon</span>
        <select id="type-select" name="types[]" multiple="multiple">
          ${typeOptions}
        </select>
      </div>
    </div>
    
    <button id="execute">Execute Query</button>
    
    <div id="results">
      <h2>Results:</h2>
      <pre id="results-content"></pre>
    </div>
  </div>
`;

document.querySelector('#generation-select')?.addEventListener('change', (event: ElementEventMap[K]): void => {
  const select: HTMLSelectElement = event.target as HTMLSelectElement;
  const queryTextarea: HTMLTextAreaElement = document.querySelector('#query') as HTMLTextAreaElement;

  let query: string[] = queryTextarea.value.split('\n');
  query = query.filter(line => !line.includes(generationWdt));
  const position = query.findIndex(line => line.includes("wdt:P279"));
  if (position !== -1) {
    query.splice(position, 0, `  ${select.value}`);
  }
  queryTextarea.value = query.join('\n');
});

$(document).ready(function() {
  $('#type-select').select2();

  $('#type-select').on('change', function() {
    const selectedValues = $(this).val();
    const queryTextarea: HTMLTextAreaElement = document.querySelector('#query') as HTMLTextAreaElement;

    const newQuery: string = `{ ${selectedValues?.join(" }\n  UNION { ")} }`;

    let query: string[] = queryTextarea.value.split('\n');
    const startPosition: number = query.findIndex(line => line.includes('wdt:P279'));
    let endPosition: number = query.findIndex(line => line.includes('wdt:P1685'));
    if (startPosition !== -1 && endPosition !== -1) {
      let i: number = startPosition + 1;
      while (i < endPosition) {
        query.splice(i, 1);
        endPosition--;
      }
      if (newQuery !== '{ undefined }') {
        query.splice(endPosition, 0, `  ${newQuery}`);
      }
    }
    queryTextarea.value = query.join('\n');
  });
});

document.querySelector('#execute')?.addEventListener('click', async () => {
  const query: string = (document.querySelector('#query') as HTMLTextAreaElement).value;
  const resultsContent: HTMLPreElement = document.querySelector('#results-content') as HTMLPreElement;

  try {
    const data = await executeSparqlQuery(query);
    if (data.length > 0) {
      createTable(data, resultsContent);
    } else {
      resultsContent.textContent = 'Nothing was found.';
    }
  } catch (error) {
    resultsContent.textContent = `Error: ${error.message}`;
  }
});

const createTable = (data: any, resultsContent: HTMLPreElement): void => {
  const table: HTMLTableElement = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';

  const thead: HTMLTableSectionElement = document.createElement('thead');
  const headerRow: HTMLTableRowElement = document.createElement('tr');

  const columns: string[] = Object.keys(data[0]);
  columns.forEach((column: string): void => {
    const th: HTMLTableCellElement = document.createElement('th');
    th.textContent = column;
    th.style.border = '1px solid black';
    th.style.padding = '8px';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody: HTMLTableSectionElement = document.createElement('tbody');
  data.forEach(row => {
    const tr: HTMLTableRowElement = document.createElement('tr');
    columns.forEach((column: string): void => {
      const td: HTMLTableCellElement = document.createElement('td');
      const value = row[column]?.value ?? 'N/A';
      if (value.endsWith('.jpg')) {
        const img: HTMLImageElement = document.createElement('img');
        img.src = value;
        img.alt = 'Image';
        img.style.maxWidth = '100px';
        img.style.height = 'auto';
        td.appendChild(img);
      } else {
        td.textContent = value;
      }
      td.style.border = '1px solid black';
      td.style.padding = '8px';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  resultsContent.textContent = '';
  resultsContent.appendChild(table);
};