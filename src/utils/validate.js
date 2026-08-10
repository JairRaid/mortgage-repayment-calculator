export const validateFormData = (data) => {
  if (!data) return false;
  return Object.values(data).every((value) => value.toString().trim() !== "");
};
