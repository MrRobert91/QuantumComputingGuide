import { describe, expect, it } from "vitest";
import { applyGates, blochVector, probabilities } from "./qubit";

describe("single-qubit simulator", () => {
  it("H|0> is an equal superposition on the +X axis", () => {
    const s = applyGates([{ name: "h" }]);
    const { p0, p1 } = probabilities(s);
    expect(p0).toBeCloseTo(0.5, 6);
    expect(p1).toBeCloseTo(0.5, 6);
    const b = blochVector(s);
    expect(b.x).toBeCloseTo(1, 6);
    expect(b.z).toBeCloseTo(0, 6);
  });

  it("X|0> = |1> (south pole)", () => {
    const b = blochVector(applyGates([{ name: "x" }]));
    expect(b.z).toBeCloseTo(-1, 6);
  });

  it("S·H|0> points along +Y (the |i> state)", () => {
    const b = blochVector(applyGates([{ name: "h" }, { name: "s" }]));
    expect(b.y).toBeCloseTo(1, 6);
    expect(b.x).toBeCloseTo(0, 6);
  });

  it("HH|0> returns to |0>", () => {
    const b = blochVector(applyGates([{ name: "h" }, { name: "h" }]));
    expect(b.z).toBeCloseTo(1, 6);
  });
});
