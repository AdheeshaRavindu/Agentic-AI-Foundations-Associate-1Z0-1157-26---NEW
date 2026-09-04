import { CONCEPTS, type Concept } from "../data/concepts";

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreMatch(query: string, concept: Concept): number {
  const q = normalize(query);
  if (!q) return 0;
  const names = [concept.id, concept.name, ...concept.aliases].map(normalize);
  let best = 0;
  for (const n of names) {
    if (n === q) best = Math.max(best, 100);
    else if (n.includes(q) || q.includes(n)) best = Math.max(best, 80);
    else {
      const qWords = q.split(" ").filter(Boolean);
      const hits = qWords.filter((w) => n.includes(w)).length;
      if (hits > 0) best = Math.max(best, Math.round((hits / qWords.length) * 60));
    }
  }
  return best;
}

export function lookupConcept(query: string): {
  found: boolean;
  concept?: Concept;
  suggestions?: string[];
} {
  const ranked = CONCEPTS.map((c) => ({ c, score: scoreMatch(query, c) })).sort(
    (a, b) => b.score - a.score
  );
  const top = ranked[0];
  if (!top || top.score < 30) {
    return {
      found: false,
      suggestions: CONCEPTS.slice(0, 8).map((c) => c.name)
    };
  }
  return { found: true, concept: top.c };
}
