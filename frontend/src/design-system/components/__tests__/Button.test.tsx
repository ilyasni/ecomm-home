import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/design-system/icons", () => ({
  Icon: ({ name, size }: { name: string; size?: number }) => (
    <span data-testid={`icon-${name}`} data-size={size} />
  ),
}));

import { Button } from "../Button";

describe("Button", () => {
  it("рендерит текст кнопки", () => {
    render(<Button>Нажми</Button>);
    expect(screen.getByRole("button", { name: "Нажми" })).toBeInTheDocument();
  });

  it("рендерит primary вариант по умолчанию", () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole("button");
    expect(btn).not.toBeDisabled();
    expect(btn.className).toContain("bg-[var(--color-button)]");
  });

  it("рендерит secondary вариант", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("border-[var(--color-button)]");
  });

  it("рендерит tertiary вариант", () => {
    render(<Button variant="tertiary">Tertiary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-[var(--color-gold)]");
  });

  it("disabled state — кнопка заблокирована", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("isLoading — показывает иконку загрузки вместо текста", () => {
    render(<Button isLoading>Loading</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(screen.getByTestId("icon-loading")).toBeInTheDocument();
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });

  it("fullWidth — устанавливает w-full", () => {
    render(<Button fullWidth>Full</Button>);
    expect(screen.getByRole("button").className).toContain("w-full");
  });

  it("размеры — small / medium / large", () => {
    const { rerender } = render(<Button size="small">S</Button>);
    expect(screen.getByRole("button").className).toContain("px-6");

    rerender(<Button size="medium">M</Button>);
    expect(screen.getByRole("button").className).toContain("h-[45px]");

    rerender(<Button size="large">L</Button>);
    expect(screen.getByRole("button").className).toContain("py-4");
  });
});
