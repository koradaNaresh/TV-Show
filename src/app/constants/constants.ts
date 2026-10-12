/** Base URLs, endpoint paths, and query parameter names for the public API. */
export const API_CONSTANTS = {
  baseUrl: "https://rickandmortyapi.com/api",
  websiteUrl: "https://rickandmortyapi.com/",
  characterEndpoint: "/character",
  episodeEndpoint: "/episode",
  characterNameParameter: "name",
  pageParameter: "page",
  firstPage: "1",
} as const;

/** Route paths shared between the router, navigation, and guards. */
export const APP_ROUTES = {
  home: "",
  characterList: "characters",
  characterDetails: "characters/:id",
  accessDenied: "access-denied",
  fallback: "**",
  characterListUrl: "/characters",
  accessDeniedUrl: "/access-denied",
  characterIdParameter: "id",
} as const;

/** Values used by the simulated role selector and browser storage. */
export const ROLE_CONSTANTS = {
  admin: "Admin",
  viewer: "Viewer",
  storageKey: "character-explorer-role",
} as const;

/** Numeric settings used for search and catalog presentation. */
export const APP_SETTINGS = {
  searchDebounceMilliseconds: 250,
  skeletonCardCount: 12,
  cardIdDigits: 3,
  rowAnimationIndexModulo: 12,
} as const;

/** Character status values used by the API and status-style logic. */
export const CHARACTER_STATUS = {
  alive: "alive",
  dead: "dead",
  unknown: "unknown",
} as const;

/** Values for the catalog's two layout modes. */
export const CHARACTER_VIEW_MODES = {
  grid: "grid",
  list: "list",
} as const;

/** CSS classes applied to character status indicators. */
export const STATUS_CLASS_NAMES = {
  indicator: "status-indicator",
  alive: "alive",
  dead: "dead",
  unknown: "unknown",
  detailPill: "status-pill",
} as const;
