const MONTH_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short' });
const RELOAD_CYCLE_LENGTH_DAYS = 56; // 8 weeks — see generate-reload-cycle.ts

/**
 * A Program's default name, derived from its creation date and the fixed 8-week
 * Reload Cycle length: "Strength Cycle <Mon> - <Mon> <Year>". Settled during
 * .scratch/training-planner-editing-model/issues/01-program-name-default-and-rename-ux.md.
 */
export function computeDefaultProgramName(createdAt: number): string {
  const start = new Date(createdAt);
  const end = new Date(createdAt);
  end.setDate(end.getDate() + RELOAD_CYCLE_LENGTH_DAYS);

  const startMonth = MONTH_FORMAT.format(start);
  const endMonth = MONTH_FORMAT.format(end);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  return startYear === endYear
    ? `Strength Cycle ${startMonth} - ${endMonth} ${endYear}`
    : `Strength Cycle ${startMonth} ${startYear} - ${endMonth} ${endYear}`;
}

/** Program names are unique per user, case-insensitively (trimmed). */
export function isProgramNameTaken(name: string, existingNames: readonly string[]): boolean {
  const normalized = name.trim().toLowerCase();
  return existingNames.some((existing) => existing.trim().toLowerCase() === normalized);
}

/**
 * Appends a " (2)", " (3)", … suffix until the name is unique — used for auto-generated
 * default names (e.g. two Programs created in the same 8-week window), where blocking
 * creation on a naming conflict would be worse UX than silently disambiguating.
 */
export function ensureUniqueProgramName(name: string, existingNames: readonly string[]): string {
  if (!isProgramNameTaken(name, existingNames)) {
    return name;
  }
  let suffix = 2;
  while (isProgramNameTaken(`${name} (${suffix})`, existingNames)) {
    suffix++;
  }
  return `${name} (${suffix})`;
}
