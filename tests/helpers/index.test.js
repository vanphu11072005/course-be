import { calculateTotal } from "../../src/helpers/index.js";

describe("Helper", () => {
  it("should calculate total price correctly", () => {
    const items = [
      { price: 100, qty: 2 },
      { price: 50, qty: 3 },
    ];
    expect(calculateTotal(items)).toBe(100 * 2 + 50 * 3);
  });
});
