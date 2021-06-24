export const getDuckName = (duckName: string, dict: Record<string, any>) => {
  try {
    const generateName = (genotype) => {
      const name = genotype
        .split("")
        .map((gene, index) => dict[gene][index])
        .join("")
        .toLowerCase();
      return name.charAt(0).toUpperCase() + name.substring(1, name.length);
    };

    const genotype = duckName.split("-")[1];
    return dict[genotype] && dict[genotype].name
      ? dict[genotype].name
      : generateName(genotype);
  } catch (e) {
    return duckName;
  }
};
