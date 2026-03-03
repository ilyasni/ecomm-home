"use client";

import { useState, useEffect } from "react";

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
        className="flex w-full items-center justify-between py-3 text-left text-sm text-[var(--color-black)] transition-colors hover:text-[var(--color-brand)]"
      >
        <span>{question}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
      {isOpen && (
        <p className="pb-3 text-sm leading-[1.5] text-[var(--color-dark-gray)]">{answer}</p>
      )}
    </div>
  );
}

export function LoyaltySection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/account/bonuses")
      .then((r) => r.json())
      .then((d: { balance?: number }) => setBalance(d.balance ?? 0))
      .catch(() => setBalance(0));
  }, []);

  const faqItems = [
    {
      question: "Как накопить бонусы?",
      answer: "Покупая определённые товары или участвуя в акциях VITA BRAVA HOME",
    },
    {
      question: "Как списать бонусы?",
      answer: "Бонусы можно списать при оформлении заказа. 1 бонус = 1 рубль.",
    },
    {
      question: "Как участвовать в программе лояльности?",
      answer:
        "Зарегистрируйтесь на сайте, и вы автоматически станете участником программы лояльности.",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-medium text-[var(--color-black)]">Программа лояльности</h2>

      {/* Бонусный баннер */}
      <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
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
              {balance === null ? "..." : `${balance} БОНУСОВ`}
            </span>
            <span className="text-sm text-[var(--color-gray)]">можно списать на покупки</span>
          </div>
          <div className="max-w-[235px] rounded-[5px] bg-[var(--color-selection)] p-4">
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
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
          <h3 className="text-base font-medium text-[var(--color-black)]">
            Условия программы лояльности
          </h3>
          <p className="mt-4 text-sm leading-[1.5] text-[var(--color-dark-gray)]">
            Зарегистрируйтесь на сайте и получайте бонусы за каждую покупку. Сколько бонусов будет
            начислено за конкретный товар, вы сможете узнать, добавив его в корзину, которые будет
            находиться под товарами
          </p>
        </div>
        <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
          {faqItems.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openFaq === index}
              onToggle={() => setOpenFaq(openFaq === index ? null : index)}
            />
          ))}
        </div>
      </div>

      {/* История операций — пока баланс без детальной истории */}
      <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
        <h3 className="mb-4 text-base font-medium text-[var(--color-black)]">
          История операций с бонусами
        </h3>
        {balance !== null && balance > 0 ? (
          <p className="text-sm text-[var(--color-dark-gray)]">
            Текущий баланс: <strong>{balance} бонусов</strong>. Детальная история операций будет
            доступна в следующем обновлении.
          </p>
        ) : (
          <p className="text-sm text-[var(--color-gray)]">
            {balance === null ? "Загрузка..." : "Операций с бонусами пока нет."}
          </p>
        )}
        {showAllHistory && (
          <button
            type="button"
            onClick={() => setShowAllHistory(false)}
            className="mt-4 text-sm text-[var(--color-brand)] underline hover:no-underline"
          >
            Скрыть
          </button>
        )}
      </div>
    </div>
  );
}
