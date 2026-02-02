import animals from "./animals.json";
import additives from "./additives.json";
import colors from "./colors.json";
export const generateName = () => {
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const additive = additives[Math.floor(Math.random() * additives.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `${color}${additive}${animal}`;
};
export const generateUniqueName = (players) => {
    const maxPossible = animals.length * additives.length * colors.length;
    if (players.length >= maxPossible) {
        throw new Error("No unique names available");
    }
    const existingNames = new Set(players.map((p) => p.name));
    for (let i = 0; i < 100; i++) {
        const candidate = generateName();
        if (!existingNames.has(candidate))
            return candidate;
    }
    for (const c of colors) {
        for (const ad of additives) {
            for (const an of animals) {
                const candidate = `${c}${ad}${an}`;
                if (!existingNames.has(candidate))
                    return candidate;
            }
        }
    }
    throw new Error("No unique names available"); // Fallback
};
