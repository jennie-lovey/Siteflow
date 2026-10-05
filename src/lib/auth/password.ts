export const PASSWORD_HINT =
  "At least 8 characters, with an uppercase letter, a lowercase letter and a number.";

// Returns an error message, or null when the password meets the rules.
export function validatePassword(password: string): string | null {
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return PASSWORD_HINT;
  }
  return null;
}
