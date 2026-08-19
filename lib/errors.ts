export class AppError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "VALIDATION"
      | "CONFLICT"
      | "INTERNAL" = "INTERNAL",
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function toUserMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  console.error(error);
  return "Une erreur inattendue s'est produite. Veuillez réessayer.";
}
