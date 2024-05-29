import { QueryEngine } from '@comunica/query-sparql';
import { generationWdt, PokemonGeneration } from "./filters/pokemon-generation.tsx";
import axios, { AxiosResponse } from "axios";

const SPARQL_URI: string = 'https://query.wikidata.org/sparql';

const QUERY_PREFIX: string = `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
`;

export const QUERY_MODEL: string = `SELECT ?item ?index ?itemLabel ?typeLabel ?image ?mass
WHERE {
  ${generationWdt}${PokemonGeneration.GenerationI}.
  ?item wdt:P279 wd:Q1569167.
  OPTIONAL { ?item wdt:P1685 ?index. }
  OPTIONAL { 
    ?item wdt:P31 ?type. 
    ?type rdfs:label ?typeLabel.
    FILTER(LANG(?typeLabel) = "en" && STRENDS(?typeLabel, "-type Pokémon"))
  }
  OPTIONAL { ?item wdt:P18 ?image. }
  OPTIONAL { ?item wdt:P2067 ?mass. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?index
`;

export const executeSparqlQueryEngine = async (query: string): Promise<any[]> => {
  try {
    const engine: QueryEngine = new QueryEngine();
    const result = await engine.queryBindings(QUERY_PREFIX.concat(query), {
      sources: [SPARQL_URI],
    });

    const bindings = await result.toArray();

    return bindings.map(binding => {
      const item: any = {};
      binding.forEach((value, key) => {
        item[key.value] = value ? value.value : null;
      });
      return item;
    });
  } catch (error) {
    console.error('SPARQL query execution error:', error);
    throw error;
  }
};

export const executeSparqlQuery = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.get('https://query.wikidata.org/sparql', {
      params: {
        query: query,
        format: 'json'
      }
    });

    return response.data.results.bindings;
  } catch (error) {
    console.error('SPARQL query execution error:', error);
    throw error;
  }
}