import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly value: string, value2: number) {
    super();
  }
}

describe("ValueObject Unit Tests", () => {
  test("value object - should be equals", () => {
    const vo1 = new StringValueObject("value");
    const vo2 = new StringValueObject("value");

    expect(vo1.equals(vo2)).toBeTruthy();
  });

  test("value object - should have both values equal", () => {
    const vo1 = new ComplexValueObject("value", 1);
    const vo2 = new ComplexValueObject("value", 1);

    expect(vo1.equals(vo2)).toBeTruthy();
  });
});
