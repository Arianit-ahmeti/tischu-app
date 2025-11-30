export const ERROR_MESSAGES = {
  ANIMAL_LOAD_FAILED: "Tier konnte nicht geladen werden.",
  ANIMAL_NOT_FOUND: "Tier nicht gefunden.",
  ANIMAL_UPDATE_FAILED: "Fehler, Aktualisierung fehlgeschlagen!",
  IMAGE_UPLOAD_FAILED: "Fehler beim Hochladen",
  IMAGE_DOWNLOAD_FAILED: "Fehler beim Herunterladen",
  ENUM_LOAD_FAILED: "Fehler beim Laden",
} as const;

export const SUCCESS_MESSAGES = {
  ANIMAL_UPDATED: "Tier wurde aktualisiert!",
  ANIMAL_CREATED: "Tier wurde hinzugefügt!",
} as const;
