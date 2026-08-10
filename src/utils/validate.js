export const validateFormData = (data) => {
  if (!data) return null;
  return Object.values(data).every((value) => value.toString().trim() !== "");
};
