import { CONCEPTS, LIMITS } from "./data/concepts";

export type ValidationResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export function validateInput(text: unknown): ValidationResult {
  if (typeof text !== "string") {
    return { ok: false, error: "Input must be a string." };
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: "Input text is empty." };
  }
  if (trimmed.length > LIMITS.maxInputChars) {
    return {
      ok: false,
      error: `Input exceeds ${LIMITS.maxInputChars} characters.`
    };
  }
  return { ok: true, text: trimmed };
}

export function truncateOutput(text: string): string {
  if (text.length <= LIMITS.maxOutputChars) return text;
  return `${text.slice(0, LIMITS.maxOutputChars - 1)}…`;
}

export function validateToolText(text: unknown): ValidationResult {
  const base = validateInput(text);
  if (!base.ok) return base;
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(base.text)) {
    return { ok: false, error: "Input contains invalid control characters." };
  }
  return base;
}

export function listConceptNames(): string[] {
  return CONCEPTS.map((c) => c.name);
}
