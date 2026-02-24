"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: 500 }}>Критическая ошибка</h1>
          <p style={{ marginTop: "1rem", color: "#666", maxWidth: "400px" }}>
            Приложение столкнулось с непредвиденной ошибкой. Пожалуйста, обновите страницу.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              border: "1px solid #333",
              background: "transparent",
              cursor: "pointer",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Обновить страницу
          </button>
        </div>
      </body>
    </html>
  );
}
