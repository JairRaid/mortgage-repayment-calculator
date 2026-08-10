export const validateFormData = (data) => {
  if (!data) return false;

  const numericKeys = ["mortgage_amount", "mortgage_term", "interest_rate"];

  return Object.entries(data).every(([key, value]) => {
    const trimmedValue = value?.toString().trim();

    // Check that field is not empty
    if (!trimmedValue) return false;

    // Ensure numeric fields are greater than 0
    if (numericKeys.includes(key)) {
      const num = Number(trimmedValue);
      return !isNaN(num) && num > 0;
    }

    return true;
  });
};
