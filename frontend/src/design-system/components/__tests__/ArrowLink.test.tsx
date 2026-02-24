import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/design-system/icons", () => ({
  Icon: ({ name, size }: { name: string; size?: number }) => (
    <span data-testid={`icon-${name}`} data-size={size} />
  ),
}));

import { ArrowLink } from "../ArrowLink";

describe("ArrowLink", () => {
  it("рендерит label текст", () => {
    render(<ArrowLink label="Перейти" />);
    expect(screen.getByText("Перейти")).toBeInTheDocument();
  });

  it("light тональность по умолчанию", () => {
    render(<ArrowLink label="Light" />);
    expect(screen.getByText("Light").className).toContain("text-[var(--color-light)]");
  });

  it("dark тональность", () => {
    render(<ArrowLink label="Dark" tone="dark" />);
    expect(screen.getByText("Dark").className).toContain("text-[var(--color-brand)]");
  });

  it("рендерит иконку стрелки", () => {
    render(<ArrowLink label="Test" />);
    expect(screen.getByTestId("icon-arrowRight")).toBeInTheDocument();
  });

  it("lg размер — увеличенный кружок", () => {
    const { container } = render(<ArrowLink label="Large" size="lg" />);
    const circle = container.querySelector("[class*='h-[60px]']");
    expect(circle).toBeInTheDocument();
  });
});
