import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, priority, unoptimized, ...rest } = props;
    void fill;
    void priority;
    void unoptimized;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="" {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

import { Categories } from "../Categories";

const testCategories = [
  { id: "cat-1", title: "Постельное белье", count: 42, image: "/cat1.jpg", isWide: true },
  { id: "cat-2", title: "Полотенца", count: 18, image: "/cat2.jpg" },
  { id: "cat-3", title: "Пледы", count: 12, image: "/cat3.jpg" },
];

describe("Categories", () => {
  it("рендерит переданные категории", () => {
    render(<Categories items={testCategories} />);
    expect(screen.getByText("Постельное белье")).toBeInTheDocument();
    expect(screen.getByText("Полотенца")).toBeInTheDocument();
    expect(screen.getByText("Пледы")).toBeInTheDocument();
  });

  it("показывает количество товаров", () => {
    render(<Categories items={testCategories} />);
    expect(screen.getByText("(42)")).toBeInTheDocument();
    expect(screen.getByText("(18)")).toBeInTheDocument();
  });

  it("рендерит изображения категорий", () => {
    render(<Categories items={testCategories} />);
    const images = screen.getAllByRole("img");
    const catImages = images.filter((img) => img.getAttribute("alt") !== "");
    expect(catImages.length).toBeGreaterThanOrEqual(3);
  });

  it("рендерит с моками по умолчанию если items не передан", () => {
    render(<Categories />);
    const articles = document.querySelectorAll("article");
    expect(articles.length).toBeGreaterThan(0);
  });
});
