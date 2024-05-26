import './style.css';
import sparqlLogo from './assets/logo-sparql.png';
import {executeSparqlQuery} from './query-sparql';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>SPARQL Query Interface</h1>
    <img src="${sparqlLogo}" class="logo" alt="SparQL logo" />
    <textarea id="query" placeholder="Enter your SPARQL query here"></textarea>
    <button id="execute">Execute Query</button>
    <div id="results">
      <h2>Results:</h2>
      <pre id="results-content"></pre>
      <div id="pokemon"></div>
    </div>
    <p class="info">
      Consult Pokemon
    </p>
  </div>
`;

document.querySelector('#execute')?.addEventListener('click', async () => {
  const query = (document.querySelector('#query') as HTMLTextAreaElement).value;
  const resultsContent = document.querySelector('#results-content') as HTMLPreElement;

  try {
    const results = await executeSparqlQuery(query);
    const jsonResults = JSON.stringify(results, null, 2);
    resultsContent.textContent = JSON.stringify(results, null, 2);

    // document.querySelector('#pokemon').innerHTML = `
    //   <img :src="image" alt="pokemon" />
    //   <ul class="list">
    //     <li>hola</li>
    //     <li>hola</li>
    //     <li>hola</li>
    //   </ul>
    // `;
  } catch (error) {
    resultsContent.textContent = `Error: ${error.message}`;
  }
});