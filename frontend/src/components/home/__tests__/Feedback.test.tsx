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
  SliderButtons: () => <div data-testid="slider-buttons" />,
}));

import { Feedback } from "../Feedback";

const testFeedbacks = [
  {
    id: "fb-1",
    name: "Анна Петрова",
    city: "Москва",
    text: "Отличное качество!",
    avatar: "/avatar1.jpg",
  },
  {
    id: "fb-2",
    name: "Иван Иванов",
    city: "Санкт-Петербург",
    text: "Рекомендую всем!",
    avatar: "/avatar2.jpg",
  },
];

describe("Feedback", () => {
  it("рендерит заголовок секции", () => {
    render(<Feedback items={testFeedbacks} />);
    expect(screen.getByText("Отзывы")).toBeInTheDocument();
  });

  it("рендерит отзывы из пропсов", () => {
    render(<Feedback items={testFeedbacks} />);
    expect(screen.getByText("Анна Петрова")).toBeInTheDocument();
    expect(screen.getByText("Иван Иванов")).toBeInTheDocument();
  });

  it("показывает город и текст отзыва", () => {
    render(<Feedback items={testFeedbacks} />);
    expect(screen.getByText("Москва")).toBeInTheDocument();
    expect(screen.getByText("Отличное качество!")).toBeInTheDocument();
  });

  it("рендерит ссылку Оставить отзыв", () => {
    render(<Feedback items={testFeedbacks} />);
    expect(screen.getByText("Оставить отзыв")).toBeInTheDocument();
  });

  it("рендерит с моками по умолчанию если items не передан", () => {
    render(<Feedback />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });
});
