/**
 * Email client — Phase 5
 *
 * Env vars (server-only):
 *   SMTP_HOST   — SMTP-сервер (обязателен для отправки)
 *   SMTP_PORT   — порт (по умолчанию 587)
 *   SMTP_SECURE — "true" для SSL/TLS (465), иначе STARTTLS (587)
 *   SMTP_USER   — логин
 *   SMTP_PASS   — пароль
 *   SMTP_FROM   — отправитель, напр. "Vita Brava Home <noreply@vitabrava.ru>"
 *   EMAIL_ADMIN — адрес администратора для уведомлений
 *
 * Graceful: если SMTP не настроен → логируем предупреждение, не бросаем.
 */

import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ?? "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";
const SMTP_FROM = process.env.SMTP_FROM ?? "Vita Brava Home <noreply@vitabrava.ru>";

export const EMAIL_ADMIN = process.env.EMAIL_ADMIN ?? "";

export function isEmailConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

let _transport: nodemailer.Transporter | null = null;

function transport(): nodemailer.Transporter {
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return _transport;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Отправляет письмо. Fire-and-forget: вызывайте через void без await
 * там, где не хотите блокировать ответ.
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn("[email] SMTP not configured, skipping:", options.subject);
    return;
  }
  try {
    await transport().sendMail({
      from: SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (err) {
    console.error("[email] Send failed:", err instanceof Error ? err.message : err);
  }
}

// ── HTML-шаблоны ──────────────────────────────────────────────────────────────

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body{font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px}
  .wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden}
  .hdr{background:#1a1a1a;color:#fff;padding:24px 32px}
  .hdr h1{margin:0;font-size:18px;font-weight:400;letter-spacing:2px}
  .body{padding:32px;color:#333;font-size:15px;line-height:1.6}
  .body h2{font-size:18px;color:#1a1a1a;margin-top:0}
  .field{margin-bottom:14px}
  .lbl{font-size:12px;color:#999;text-transform:uppercase;margin-bottom:3px}
  .val{font-size:15px;color:#333}
  hr{border:none;border-top:1px solid #eee;margin:24px 0}
  .tbl{width:100%;border-collapse:collapse;font-size:14px}
  .tbl th{text-align:left;color:#999;font-size:12px;text-transform:uppercase;padding:6px 0;border-bottom:1px solid #eee}
  .tbl td{padding:10px 0;border-bottom:1px solid #f5f5f5;vertical-align:top}
  .total-row{font-weight:bold;font-size:16px}
  .ftr{background:#f8f5f2;padding:16px 32px;font-size:12px;color:#aaa;text-align:center}
</style>
</head>
<body>
  <div class="wrap">
    <div class="hdr"><h1>VITA BRAVA HOME</h1></div>
    <div class="body">${content}</div>
    <div class="ftr">© Vita Brava Home. Москва, Россия</div>
  </div>
</body>
</html>`;
}

function field(label: string, value: string): string {
  if (!value) return "";
  return `<div class="field"><div class="lbl">${label}</div><div class="val">${esc(value)}</div></div>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Конкретные шаблоны ────────────────────────────────────────────────────────

export interface ContactEmailData {
  name: string;
  phone: string;
  message: string;
}

export function contactAdminHtml(data: ContactEmailData): string {
  return layout(`
    <h2>Новое сообщение с сайта</h2>
    ${field("Имя", data.name)}
    ${field("Телефон", data.phone)}
    ${field("Сообщение", data.message)}
  `);
}

export interface PartnershipEmailData {
  name: string;
  phone: string;
  email: string;
  city: string;
}

export function partnershipAdminHtml(data: PartnershipEmailData): string {
  return layout(`
    <h2>Новая заявка на сотрудничество</h2>
    ${field("Имя", data.name)}
    ${field("Телефон", data.phone)}
    ${field("Email", data.email)}
    ${field("Город", data.city)}
  `);
}

export interface OrderRequestEmailData {
  name: string;
  phone: string;
  email: string;
  variant: string;
  comment: string;
}

export function orderRequestAdminHtml(data: OrderRequestEmailData): string {
  const variantLabel = data.variant === "consultation" ? "Консультация" : "Заказ";
  return layout(`
    <h2>Новая заявка: ${esc(variantLabel)}</h2>
    ${field("Имя", data.name)}
    ${field("Телефон", data.phone)}
    ${field("Email", data.email)}
    ${field("Комментарий", data.comment)}
  `);
}

export interface OrderItem {
  title: string;
  quantity: number;
  price: string;
}

export interface OrderConfirmationEmailData {
  orderId: string;
  customerName: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: string;
  total: string;
  promoDiscount?: string;
  bonusDiscount?: string;
  deliveryPrice: string;
}

export function orderConfirmationHtml(data: OrderConfirmationEmailData): string {
  const rows = data.items
    .map(
      (item) =>
        `<tr>
          <td>${esc(item.title)}</td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:right;white-space:nowrap">${esc(item.price)}</td>
        </tr>`
    )
    .join("");

  const discountRows = [
    data.promoDiscount
      ? `<tr><td colspan="2">Скидка (промокод)</td><td style="text-align:right">−${esc(data.promoDiscount)}</td></tr>`
      : "",
    data.bonusDiscount
      ? `<tr><td colspan="2">Бонусы</td><td style="text-align:right">−${esc(data.bonusDiscount)}</td></tr>`
      : "",
    `<tr><td colspan="2">Доставка</td><td style="text-align:right">${esc(data.deliveryPrice)}</td></tr>`,
  ]
    .filter(Boolean)
    .join("");

  return layout(`
    <h2>Ваш заказ принят!</h2>
    <p>Уважаемый(ая) ${esc(data.customerName)}, мы получили ваш заказ
    <strong>#${esc(data.orderId)}</strong> и свяжемся с вами в ближайшее время.</p>

    <hr>

    <table class="tbl">
      <thead>
        <tr>
          <th>Товар</th>
          <th style="text-align:center">Кол-во</th>
          <th style="text-align:right">Цена</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr><td colspan="3" style="padding:4px 0"></td></tr>
        ${discountRows}
        <tr class="total-row">
          <td colspan="2">Итого</td>
          <td style="text-align:right">${esc(data.total)}</td>
        </tr>
      </tbody>
    </table>

    <hr>

    ${field("Адрес доставки", data.deliveryAddress)}

    <p style="color:#888;font-size:13px;margin-top:24px">
      Если у вас возникли вопросы, напишите нам или позвоните по телефону,
      указанному на сайте.
    </p>
  `);
}
