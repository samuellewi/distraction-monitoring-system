export const categoryTypes = ["PRODUCTIVE", "DISTRACTING", "NEUTRAL"] as const;

export type CategoryType = (typeof categoryTypes)[number];

export const CategoryType = {
  PRODUCTIVE: "PRODUCTIVE",
  DISTRACTING: "DISTRACTING",
  NEUTRAL: "NEUTRAL"
} as const satisfies Record<CategoryType, CategoryType>;
