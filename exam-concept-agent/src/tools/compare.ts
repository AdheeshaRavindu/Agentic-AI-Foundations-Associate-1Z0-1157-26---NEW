import { CONCEPTS, type Concept } from "../data/concepts";
import { lookupConcept } from "./lookup";

export function compareConcepts(
  a: string,
  b: string
): {
  ok: boolean;
  error?: string;
  left?: Concept;
  right?: Concept;
  contrast?: string;
} {
  const left = lookupConcept(a);
  const right = lookupConcept(b);
  if (!left.found || !left.concept) {
    return {
      ok: false,
      error: `Unknown concept: "${a}". Try: ${CONCEPTS.map((c) => c.name).slice(0, 6).join(", ")}`
    };
  }
  if (!right.found || !right.concept) {
    return {
      ok: false,
      error: `Unknown concept: "${b}". Try: ${CONCEPTS.map((c) => c.name).slice(0, 6).join(", ")}`
    };
  }
  return {
    ok: true,
    left: left.concept,
    right: right.concept,
    contrast: `${left.concept.name}: ${left.concept.definition}\n\n${right.concept.name}: ${right.concept.definition}\n\nExam tip — ${left.concept.name}: ${left.concept.examTip}\nExam tip — ${right.concept.name}: ${right.concept.examTip}`
  };
}
