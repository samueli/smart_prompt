"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export function SettingsForm() {
  const t = useTranslations("Settings")
  const [token, setToken] = React.useState("")
  const [notifications, setNotifications] = React.useState(true)

  const generateToken = () => {
    const newToken = Math.random().toString(36).substring(2)
    setToken(newToken)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("token")}</label>
        <div className="flex gap-2">
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={t("tokenPlaceholder")}
          />
          <Button onClick={generateToken}>{t("generate")}</Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{t("notifications")}</label>
        <Switch
          checked={notifications}
          onCheckedChange={setNotifications}
        />
      </div>
      <Button className="w-full">{t("save")}</Button>
    </div>
  )
} 