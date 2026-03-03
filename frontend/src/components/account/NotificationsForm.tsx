"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Checkbox, Button } from "@/design-system";
import { notificationSettings, type NotificationSetting } from "@/data/account";

export function NotificationsForm() {
  const [settings, setSettings] = useState<NotificationSetting[]>(notificationSettings);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (id: string, channel: "email" | "sms") => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, [channel]: !s[channel] } : s)));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: settings.map(({ id, email, sms }) => ({ id, email, sms })),
        }),
      });
      if (!res.ok) throw new Error("save failed");
      toast.success("Настройки уведомлений сохранены");
    } catch {
      toast.error("Не удалось сохранить настройки. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-medium text-[var(--color-black)]">Настройка уведомлений</h2>
        <p className="mt-2 text-sm text-[var(--color-dark-gray)]">
          Укажите, какие уведомления вы бы хотели получать
        </p>
      </div>

      <div className="max-w-[627px]">
        {/* Header */}
        <div className="mb-2 flex items-center gap-4">
          <span className="w-10 text-center text-sm text-[var(--color-gray)]">E-mail</span>
          <span className="w-10 text-center text-sm text-[var(--color-gray)]">СМС</span>
        </div>

        {/* Rows */}
        <div className="flex flex-col">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center gap-4 border-b border-[var(--color-gray-light)] py-3 last:border-b-0"
            >
              <div className="flex w-10 justify-center">
                <Checkbox
                  checked={setting.email}
                  onChange={() => handleToggle(setting.id, "email")}
                />
              </div>
              <div className="flex w-10 justify-center">
                <Checkbox checked={setting.sms} onChange={() => handleToggle(setting.id, "sms")} />
              </div>
              <span className="text-sm text-[var(--color-dark-gray)]">{setting.label}</span>
            </div>
          ))}
        </div>

        <Button variant="primary" className="mt-6" onClick={handleSave} isLoading={isSubmitting}>
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
}
