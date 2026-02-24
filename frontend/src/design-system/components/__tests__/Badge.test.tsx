import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("рендерит текст метки", () => {
    render(<Badge label="NEW" />);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("exclusive тональность по умолчанию", () => {
    render(<Badge label="Exclusive" />);
    expect(screen.getByText("Exclusive").className).toContain("bg-[var(--color-gold)]");
  });

  it("sale тональность", () => {
    render(<Badge label="Sale" tone="sale" />);
    expect(screen.getByText("Sale").className).toContain("bg-[var(--color-brand)]");
  });

  it("new тональность", () => {
    render(<Badge label="New" tone="new" />);
    expect(screen.getByText("New").className).toContain("bg-[var(--color-gold)]");
  });

  it("desktop размер по умолчанию", () => {
    render(<Badge label="Desktop" />);
    expect(screen.getByText("Desktop").className).toContain("text-sm");
  });

  it("mobile размер", () => {
    render(<Badge label="Mobile" size="mobile" />);
    expect(screen.getByText("Mobile").className).toContain("text-xs");
  });

  it("принимает дополнительный className", () => {
    render(<Badge label="Custom" className="test-class" />);
    expect(screen.getByText("Custom").className).toContain("test-class");
  });
});
