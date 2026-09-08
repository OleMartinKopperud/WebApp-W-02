// @vitest-environment happy-dom
//
// Linja over MÅ stå øverst i komponenttester. Resten av testene kjører i node,
// der det ikke finnes noe DOM å rendre i.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "../Counter";

describe("Counter", () => {
  it("starter på null", () => {
    render(<Counter />);

    expect(screen.getByText("Trykket 0 ganger")).toBeInTheDocument();
  });

  it("teller opp når du trykker", async () => {
    // userEvent gjør det en ekte bruker gjør: fokus, trykk, hendelser.
    const bruker = userEvent.setup();
    render(<Counter />);

    await bruker.click(screen.getByRole("button", { name: "Trykk her" }));

    expect(screen.getByText("Trykket 1 ganger")).toBeInTheDocument();
  });
});
