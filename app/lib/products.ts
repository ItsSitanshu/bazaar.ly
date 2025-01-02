const validateText = (text: string, fieldName: string, min: number = 3, max?: number): string | null => {
  if (!text) return `${fieldName} is required.`;
  if (text.length < min) return `${fieldName} must be at least ${min} characters long.`;
  if (max && text.length > max) return `${fieldName} must be at most ${max} characters long.`;
  return null;
};

const validateTextPara = (text: string, fieldName: string, minWords: number = 3, maxWords?: number): string | null => {
  if (!text) return `${fieldName} is required.`;

  const wordCount = text.trim().split(/\s+/).length;

  if (wordCount < minWords) return `${fieldName} must have at least ${minWords} words.`;
  if (maxWords && wordCount > maxWords) return `${fieldName} must have at most ${maxWords} words.`;

  return null;
};

const validateEmail = (email: string): string | null => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!email) return "Email is required.";
  if (!emailRegex.test(email)) return "Invalid email format.";
  return null;
};

const validateNumber = (number: number, fieldName: string): string | null => {
  if (isNaN(number)) return `${fieldName} must be a valid number.`;
  if (number <= 0) return `${fieldName} must be non-negative.`;
  return null;
};

const validatePercentage = (value: number, fieldName: string, min: number = 0, max: number = 100): string | null => {
  if (value === undefined || value === null) return `${fieldName} is required.`;
  if (value < min) return `${fieldName} must be at least ${min}%.`;
  if (value > max) return `${fieldName} must be at most ${max}%.`;
  return null;
};

export { validateNumber, validatePercentage, validateText, validateTextPara, validateEmail };