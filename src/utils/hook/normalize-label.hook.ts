export const normalizeLabel = (label: string) => {
  if (!label) return "dashboard"; // fallback cuando estamos en /dashboard
  return label.trim().toLowerCase().replace(/\s+/g, "-");
};
