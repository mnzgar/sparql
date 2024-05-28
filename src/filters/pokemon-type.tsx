export const typeWdt: string = '?item wdt:P31 wd:';

export enum PokemonType {
  Unknown = "Q5996279",
  Fire = "Q25930490",
  Flying = "Q25930493",
  Water = "Q25930495",
  Normal = "Q25930498",
  Fighting = "Q25930532",
  Grass = "Q25930653",
  Poison = "Q25930717",
  Electric = "Q25930719",
  Ground = "Q25930733",
  Psychic = "Q25930740",
  Rock = "Q25930744",
  Ice = "Q25930752",
  Bug = "Q25930757",
  Dragon = "Q25930759",
  Ghost = "Q25930806",
  Dark = "Q25930811",
  Steel = "Q25930813",
  Fairy = "Q25930814"
}

export const getAllPokemonTypes = (): string[] => Object.values(PokemonType);

export const typeOptions: string = getAllPokemonTypes().map(value => {
  const name = Object.keys(PokemonType).find(key => PokemonType[key as keyof typeof PokemonType] === value);
  return `<option value="${typeWdt}${value}.">${name}</option>`;
}).join('');