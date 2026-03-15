import { describe, expect, it } from "vitest";
import {
  getNationalIdValidationStatus,
  normalizeNationalId,
  parseEgyptianNationalIdBirthDate,
  validateNationalId,
} from "@/lib/national-id";

describe("national-id utilities", () => {
  it("normalizes non-digit characters", () => {
    expect(normalizeNationalId("298-0101 123456")) .toBe("2980101123456");
  });

  it("accepts structurally valid Egyptian national IDs", () => {
    const result = validateNationalId("29801011234567");
    expect(result.isPresent).toBe(true);
    expect(result.isExactLength).toBe(true);
    expect(result.isValid).toBe(true);
    expect(parseEgyptianNationalIdBirthDate("29801011234567")).not.toBeNull();
  });

  it("rejects invalid dates embedded in national IDs", () => {
    const result = validateNationalId("39913311234567");
    expect(result.isExactLength).toBe(true);
    expect(result.isValid).toBe(false);
  });

  it("returns UNKNOWN for missing values and INVALID for malformed values", () => {
    expect(getNationalIdValidationStatus("")).toBe("UNKNOWN");
    expect(getNationalIdValidationStatus("123")).toBe("INVALID");
  });
});
