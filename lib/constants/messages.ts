export const ERROR_MESSAGES = {
  ERROR: "Fehler",
  WARNING: "Warnung",
  ANIMAL_LOAD_FAILED: "Tier konnte nicht geladen werden.",
  ANIMAL_NOT_FOUND: "Tier nicht gefunden.",
  ANIMAL_UPDATE_FAILED: "Fehler, Aktualisierung fehlgeschlagen!",
  IMAGE_UPLOAD_FAILED: "Fehler beim Hochladen",
  IMAGE_DOWNLOAD_FAILED: "Fehler beim Herunterladen",
  IMAGE_SELECTION_FAILED: "Fehler beim Auswählen der Bilder",
  ENUM_LOAD_FAILED: "Fehler beim Laden",
  ORG_PROFILE_LOAD_FAILED: "Vereinprofil konnte nicht geladen werden.",
  ORG_SESSION_FAILED: "Sitzung fehlgeschlagen.",
  ORG_SAVE_FAILED: "Fehler beim Speichern des Vereins.",
  ORG_NOT_FOUND: "Verein nicht gefunden.",
  USER_CONTACT_SAVE_FAILED: "Kontaktdaten des Nutzers konnten nicht gespeichert werden",
  USER_CONTACT_LOAD_FAILED: "Kontaktdaten des Nutzers konnten nicht geladen werden",
  USER_CONTACT_UPDATE_FAILED: "Kontaktdaten des Nutzers konnten nicht aktualisiert wereden",
  USER_SITUATION_SAVE_FAILED: "Adoptionsformular des Nutzers konnte nicht gespeichert werden",
  ADOPTION_CONTACT_SAVE_FAILED: "Adoptionsanfrage konnte nicht gespeichert werden",
  NO_USER_ON_SESSION: "Es ist kein Nutzer eingeloggt",
  USER_NOT_FOUND: "Nutzer konnte nicht in Datenbank gefunden werden"
} as const;

export const SUCCESS_MESSAGES = {
  SUCCESS: "Erfolg",
  ANIMAL_UPDATED: "Tier wurde aktualisiert!",
  ANIMAL_CREATED: "Tier wurde hinzugefügt!",
  USER_CONTACT_SAVED: "Kontaktdaten des Nutzers wurde gespeichert!",
  USER_CONTACT_UPDATED: "Kontaktdatendes Nutzers wurden aktualisiert!",
  USER_SITUATION_SAVED: "Adoptionsformular des Nutzers wurde gespeichert!",
  ADOPTION_CONTACT_SAVED: "Adoptionsanfrage wurde gesendet!",
} as const;
