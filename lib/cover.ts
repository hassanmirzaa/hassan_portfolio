// Which screenshots stand on a project's home card, and where. Left and right are the tilted back
// phones, center is the front one. Plain data helpers with no imports, so client components can use them.
export type Slot = "left" | "center" | "right"
export const SLOTS: Slot[] = ["left", "center", "right"]

export function isSlot(x: unknown): x is Slot {
  return x === "left" || x === "center" || x === "right"
}

/** The screens for the card in left, center, right order. With no slot picked, the first three screens. */
export function coverScreens<T extends { slot?: unknown }>(screens: T[]): T[] {
  const picked = SLOTS.map((slot) => screens.find((s) => s.slot === slot)).filter((s): s is T => !!s)
  return picked.length ? picked : screens.slice(0, 3)
}
