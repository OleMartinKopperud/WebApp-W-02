"use client";

export function TimeClient() {
  return (
    <p className="mt-6 text-sm text-slate-500">
      Rendret på klienten {new Date().toLocaleString("no-NO")}. Last siden på
      nytt, så endrer tallet seg.
    </p>
  );
}
