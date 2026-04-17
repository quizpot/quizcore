import animals from "./animals.json";
import additives from "./additives.json";
import colors from "./colors.json";

export const generateName = (): string => {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const additive = additives[Math.floor(Math.random() * additives.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return `${color}${additive}${animal}`;
};

export const generateUniqueName = (names: Set<string>): string => {
  const totalColors = colors.length;
  const totalAdditives = additives.length;
  const totalAnimals = animals.length;
  const maxPossible = totalColors * totalAdditives * totalAnimals;

  if (names.size >= maxPossible) throw new Error("No unique names available");

  for (let i = 0; i < 20; i++) {
    const candidate = generateName();
    if (!names.has(candidate)) return candidate;
  }

  const startOffset = Math.floor(Math.random() * maxPossible);
  
  for (let i = 0; i < maxPossible; i++) {
    const currentIndex = (startOffset + i) % maxPossible;
    
    const colorIdx = Math.floor(currentIndex / (totalAdditives * totalAnimals));
    const additiveIdx = Math.floor(currentIndex / totalAnimals) % totalAdditives;
    const animalIdx = currentIndex % totalAnimals;

    const candidate = `${colors[colorIdx]}${additives[additiveIdx]}${animals[animalIdx]}`;
    
    if (!names.has(candidate)) return candidate;
  }

  throw new Error("No unique names available");
};