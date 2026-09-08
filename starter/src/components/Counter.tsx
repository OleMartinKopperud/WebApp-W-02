"use client";

import { useEffect, useState } from "react";

/**
 * En klient-komponent. `"use client"` MÅ stå på linje 1, ikke etter en
 * kommentar eller en import.
 *
 * Uten det direktivet kjører fila på serveren, og da finnes verken `useState`
 * eller `onClick`. Det er hele forskjellen på denne fila og Home.tsx.
 *
 * Knappen er `disabled` til komponenten har hydrert. Fram til da er den bare
 * HTML, og et klikk forsvinner i løse luften.
 */
export function Counter() {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // useEffect kjører bare i nettleseren, aldri under server-rendringen.
  useEffect(() => setHydrated(true), []);

  return (
    <div className="mt-6 flex items-center gap-3">
      <button
        type="button"
        disabled={!hydrated}
        onClick={() => setCount(count + 1)}
        className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
      >
        Trykk her
      </button>
      <span>Trykket {count} ganger</span>
    </div>
  );
}
