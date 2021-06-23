import { IDuck } from "./services/watcherService";

type TDuckName = { name; unique?: true };
type TDuckDict = string[];

const Ducks: Record<string, TDuckName | TDuckDict> = {
  AAAAAAAA: {
    name: "Elon",
  },
  BBBBBBBB: {
    name: "Satoshi",
  },
  CCCCCCCC: {
    name: "Doge",
  },
  DDDDDDDD: {
    name: "Bogdanoff",
  },
  EEEEEEEE: {
    name: "Chad",
  },
  WWWWWWWW: {
    name: "Sasha",
    unique: true,
  },
  A: ["e", "l", "o", "n", "n", "o", "l", "e"],
  B: ["s", "a", "t", "o", "s", "h", "i", "t"],
  C: ["d", "o", "g", "e", "e", "g", "o", "d"],
  D: ["b", "o", "g", "d", "a", "n", "o", "f"],
  E: ["c", "h", "a", "d", "a", "d", "c", "h"],
  W: ["S", "a", "s", "h", "a", "g", "o", "d"],
};

const generateName = (genotype) => {
  const name = genotype
    .split("")
    .map((gene, index) => Ducks[gene][index])
    .join("")
    .toLowerCase();
  return name.charAt(0).toUpperCase() + name.substring(1, name.length);
};

export const getDuckName = (duckName: string) => {
  const genotype = duckName.split("-")[1];
  return Ducks[genotype] && (Ducks[genotype] as any).name
    ? (Ducks[genotype] as any).name
    : generateName(genotype);
};
