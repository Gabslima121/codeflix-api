import { validate } from "uuid";
import { InvalidUuidError, Uuid } from "../uuid.vo";

describe("Uuid Unit Tests", () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");

  test("uuid vo - should throw error when uuid is invalid", () => {
    expect(() => {
      new Uuid("invalid-uuid");
    }).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("uuid vo - should create a valid uuid", () => {
    const uuid = new Uuid();

    expect(uuid.id).toBeDefined();
    expect(validate(uuid.id)).toBe(true);
    expect(validateSpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("uuid vo - should accept a valid uuid", () => {
    const uuid = new Uuid("05ff1dfb-a70b-4464-8f7e-f16c843d4678");

    expect(uuid.id).toBe("05ff1dfb-a70b-4464-8f7e-f16c843d4678");
    expect(validateSpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
