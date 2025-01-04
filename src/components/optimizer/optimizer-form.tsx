"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"

export function OptimizerForm() {
  const t = useTranslations("Optimizer")
  const [input, setInput] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [direction, setDirection] = React.useState("clarity")
  const [loading, setLoading] = React.useState(false)

  const handleOptimize = async () => {
    setLoading(true)
    try {
      // TODO: Implement optimization logic
      setOutput("Optimized prompt will appear here...")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("input")}</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={5}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("direction")}</label>
        <Select
          value={direction}
          onValueChange={setDirection}
          options={[
            { value: "clarity", label: t("clarity") },
            { value: "creativity", label: t("creativity") },
            { value: "precision", label: t("precision") },
          ]}
        />
      </div>
      <Button
        onClick={handleOptimize}
        disabled={!input || loading}
        className="w-full"
      >
        {loading ? t("optimizing") : t("optimize")}
      </Button>
      {output && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("output")}</label>
          <Textarea value={output} readOnly rows={5} />
        </div>
      )}
    </div>
  )
} 