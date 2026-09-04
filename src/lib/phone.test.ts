import { describe, it, expect } from "vitest";
import { maskPhone, isValidPhone, onlyDigits } from "./phone";

describe("onlyDigits", () => {
  it("removes non-digits", () => {
    expect(onlyDigits("(11) 91234-5678")).toBe("11912345678");
    expect(onlyDigits("abc123")).toBe("123");
  });
});

describe("maskPhone", () => {
  it("masks correctly depending on length", () => {
    expect(maskPhone("11")).toBe("(11");
    expect(maskPhone("119123")).toBe("(11) 9123");
    expect(maskPhone("119123456")).toBe("(11) 9123-456");
    expect(maskPhone("11912345678")).toBe("(11) 91234-5678");
  });
});

describe("isValidPhone", () => {
  it("validates length 10 or 11", () => {
    expect(isValidPhone("11912345678")).toBe(true);
    expect(isValidPhone("1143215678")).toBe(true);
    expect(isValidPhone("123")).toBe(false);
  });
});
