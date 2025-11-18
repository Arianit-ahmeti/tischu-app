export function parsePostgresArray(data: string): string[] {
  const cleaned = data.slice(1, -1);
  if (cleaned.length === 0) return [];
  return cleaned.split(",").map((item) => item.trim());
}
