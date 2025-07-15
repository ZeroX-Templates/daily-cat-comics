
const CAT_PROMPTS: string[] = [
  "trying to get its human's attention while they work",
  "encountering a cucumber for the first time",
  "the epic saga of chasing the red dot",
  "attempting to 'help' with household chores",
  "discovering its own reflection in a mirror",
  "the strategic mission to steal a piece of chicken",
  "trying to fit into a box that is clearly too small",
  "the intense negotiation for more food right after being fed",
  "waking up its human for breakfast at 5 AM",
  "a dramatic reaction to seeing the bottom of the food bowl",
  "the cat versus a houseplant",
  "a failed attempt at a graceful leap",
  "finding the warmest, most inconvenient place to nap",
  "investigating a mysterious noise",
  "trying to catch a sunbeam that keeps moving",
  "the challenge of a closed door",
  "unraveling a roll of toilet paper with great joy",
  "interacting with a robot vacuum cleaner",
  "being introduced to a new kitten",
  "the cat's internal monologue during a vet visit",
  "trying to operate a human object, like a TV remote",
  "a cat's elaborate plan to get the best spot on the sofa",
  "experiencing catnip for the first time",
  "the silent judgment of its human's life choices",
  "hiding from a bath",
  "the quest to capture a single fly buzzing in the room",
  "a cat discovering its love for an empty cardboard box",
  "trying to understand why the human is singing",
  "a staring contest with a garden gnome",
  "the drama of a slightly moved piece of furniture"
];

/**
 * Gets a consistent prompt theme for the current day of the year in the US Eastern Timezone.
 * This ensures every user sees the same comic theme on the same day, changing at midnight ET.
 * @returns A string prompt from the CAT_PROMPTS array.
 */
export const getDailyPrompt = (): string => {
  const now = new Date();
  // Create a new Date object representing the current time in ET.
  // This is generally reliable for en-US locale.
  const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

  const startOfYear = new Date(etDate.getFullYear(), 0, 0);
  const diff = etDate.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Use (dayOfYear - 1) to ensure the first day of the year maps to index 0.
  const promptIndex = (dayOfYear - 1) % CAT_PROMPTS.length;
  return CAT_PROMPTS[promptIndex];
};
