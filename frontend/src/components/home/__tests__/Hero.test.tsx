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

vi.mock("@/components/ui/Carousel", () => ({
  Carousel: ({ slides }: { slides: React.ReactNode[] }) => (
    <div data-testid="carousel">{slides}</div>
  ),
}));

vi.mock("@/design-system/components", () => ({
  ArrowLink: ({ label }: { label: string }) => <span>{label}</span>,
}));

import { Hero } from "../Hero";

const testSlides = [
  {
    id: 1,
    title: "Тестовый баннер",
    subtitle: "Подзаголовок",
    action: "Перейти",
    desktopImage: "/test-desktop.jpg",
    mobileImage: "/test-mobile.jpg",
  },
  {
    id: 2,
    title: "Второй баннер",
    subtitle: "Описание",
    action: "Смотреть",
    desktopImage: "/test-desktop-2.jpg",
    mobileImage: "/test-mobile-2.jpg",
  },
];

describe("Hero", () => {
  it("рендерит слайды из пропсов", () => {
    render(<Hero slides={testSlides} />);
    expect(screen.getByText("Тестовый баннер")).toBeInTheDocument();
    expect(screen.getByText("Второй баннер")).toBeInTheDocument();
  });

  it("рендерит Carousel", () => {
    render(<Hero slides={testSlides} />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("рендерит подзаголовок и action", () => {
    render(<Hero slides={testSlides} />);
    expect(screen.getByText("Подзаголовок")).toBeInTheDocument();
    expect(screen.getByText("Перейти")).toBeInTheDocument();
  });

  it("рендерит с моками по умолчанию если slides не передан", () => {
    render(<Hero />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });
});
