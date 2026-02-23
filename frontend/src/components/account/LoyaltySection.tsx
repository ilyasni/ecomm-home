"use client";

import { useState } from "react";
import { accountUser, bonusOperations } from "@/data/account";

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[var(--color-gray-light)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3 text-left text-sm text-[var(--color-black)] hover:text-[var(--color-brand)] transition-colors"
      >
        <span>{question}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>
      {isOpen && (
        <p className="pb-3 text-sm leading-[1.5] text-[var(--color-dark-gray)]">
          {answer}
        </p>
      )}
    </div>
  );
}

export function LoyaltySection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const faqItems = [
    {
      question: "Как накопить бонусы?",
      answer:
        "Покупая определённые товары или участвуя в акциях VITA BRAVA HOME",
    },
    {
      question: "Как списать бонусы?",
      answer:
        "Бонусы можно списать при оформлении заказа. 1 бонус = 1 рубль.",
    },
    {
      question: "Как участвовать в программе лояльности?",
      answer:
        "Зарегистрируйтесь на сайте, и вы автоматически станете участником программы лояльности.",
    },
  ];

  const displayedOperations = showAllHistory
    ? bonusOperations
    : bonusOperations.slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-medium text-[var(--color-black)]">
        Программа лояльности
      </h2>

      {/* Бонусный баннер */}
      <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="text-base font-medium text-[var(--color-black)]">
                Накоплено бонусов
              </span>
              <span className="rounded-[5px] border border-[var(--color-gray-light)] px-2 py-0.5 text-xs text-[var(--color-gray)]">
                1 БОНУС = 1 ₽
              </span>
            </div>
            <span className="text-lg font-medium text-[var(--color-brand)]">
              {accountUser.bonuses} БОНУСОВ
            </span>
            <span className="text-sm text-[var(--color-gray)]">
              можно списать на покупки
            </span>
          </div>
          <div className="rounded-[5px] bg-[var(--color-selection)] p-4 max-w-[235px]">
            <p className="text-sm text-[var(--color-dark-gray)]">
              Получи дополнительные 50 бонусов, оставив отзыв на сайте
            </p>
            <button
              type="button"
              className="mt-2 text-sm text-[var(--color-brand)] underline hover:no-underline"
            >
              Узнать подробнее
            </button>
          </div>
        </div>
      </div>

      {/* Условия и FAQ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
          <h3 className="text-base font-medium text-[var(--color-black)]">
            Условия программы лояльности
          </h3>
          <p className="mt-4 text-sm leading-[1.5] text-[var(--color-dark-gray)]">
            Зарегистрируйтесь на сайте и получайте бонусы за каждую покупку. Сколько
            бонусов будет начислено за конкретный товар, вы сможете узнать, добавив
            его в корзину, которые будет находиться под товарами
          </p>
        </div>
        <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
          {faqItems.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openFaq === index}
              onToggle={() =>
                setOpenFaq(openFaq === index ? null : index)
              }
            />
          ))}
        </div>
      </div>

      {/* История операций */}
      <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
        <h3 className="text-base font-medium text-[var(--color-black)] mb-4">
          История операций с бонусами
        </h3>
        <div className="flex flex-col">
          {displayedOperations.map((op) => (
            <div
              key={op.id}
              className="flex items-start justify-between border-b border-[var(--color-gray-light)] py-4 last:border-b-0"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[var(--color-gray)]">
                  {op.date}
                </span>
                <span className="text-sm text-[var(--color-dark-gray)]">
                  {op.description}
                </span>
              </div>
              <span
                className={`text-sm font-medium shrink-0 ${
                  op.amount > 0
                    ? "text-[var(--color-black)]"
                    : "text-[var(--color-dark-gray)]"
                }`}
              >
                {op.amount > 0 ? `+${op.amount}` : op.amount}
              </span>
            </div>
          ))}
        </div>
        {!showAllHistory && bonusOperations.length > 4 && (
          <button
            type="button"
            onClick={() => setShowAllHistory(true)}
            className="mt-4 text-sm text-[var(--color-brand)] underline hover:no-underline"
          >
            Показать еще
          </button>
        )}
      </div>
    </div>
  );
}
