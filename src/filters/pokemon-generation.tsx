export const generationWdt: string = '?item wdt:P361 wd:';

export enum PokemonGeneration {
  GenerationI = "Q3245450",
  GenerationII = "Q3245448",
  GenerationIII = "Q3245454",
  GenerationIV = "Q657233",
  GenerationV = "Q3245449",
  GenerationVI = "Q2758090",
  GenerationVII = "Q24260130",
  GenerationVIII = "Q61951107",
  GenerationIX = "Q111033352"
}

export const getAllPokemonGenerations = (): string[] => Object.values(PokemonGeneration);

export const generationOptions: string = getAllPokemonGenerations().map(value => {
  const name = Object.keys(PokemonGeneration).find(key => PokemonGeneration[key as keyof typeof PokemonGeneration] === value);
  return `<option value="${generationWdt}${value}.">${name}</option>`;
}).join('');