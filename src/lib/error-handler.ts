/**
 * Sanitize database error messages for user display.
 * Logs the real error to console for debugging.
 */
export function handleDbError(error: { message?: string; code?: string } | null, fallback = "Operation failed") {
  if (!error) return;
  
  // Log real error for debugging
  console.error("[DB Error]", error);

  // Map known Postgres error codes to user-friendly messages
  const codeMap: Record<string, string> = {
    "23505": "This record already exists.",
    "23503": "Referenced record not found.",
    "42501": "Permission denied.",
    "23502": "Required field is missing.",
  };

  if (error.code && codeMap[error.code]) {
    return codeMap[error.code];
  }

  return fallback;
}
