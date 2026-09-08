import { cn } from "@/lib/utils"

type Props = {
  proteinGrams: number
  fatGrams: number
  carbsGrams: number
  className?: string
}

const MACROS = [
  { key: "protein", label: "Protein", calsPerGram: 4, color: "bg-accent" },
  { key: "fat", label: "Fat", calsPerGram: 9, color: "bg-signal" },
  { key: "carbs", label: "Carbs", calsPerGram: 4, color: "bg-danger" },
] as const

export function MacroBreakdownBar({ proteinGrams, fatGrams, carbsGrams, className }: Props) {
  const proteinCals = Math.max(0, proteinGrams) * 4
  const fatCals = Math.max(0, fatGrams) * 9
  const carbsCals = Math.max(0, carbsGrams) * 4
  const totalCals = proteinCals + fatCals + carbsCals

  const cals = [proteinCals, fatCals, carbsCals]
  const pcts = totalCals > 0
    ? cals.map((c) => Math.round((c / totalCals) * 100))
    : [33, 34, 33]

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-surface">
        {MACROS.map(({ key, color }, i) => (
          <div
            key={key}
            className={cn("h-full transition-all duration-200", color)}
            style={{ width: `${pcts[i]}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-ink-muted">
        {MACROS.map(({ key, label }, i) => (
          <span key={key} className="flex items-center gap-1">
            <span
              className={cn("inline-block h-2 w-2 rounded-full", MACROS[i].color)}
            />
            {label}{" "}
            <span className="font-medium text-ink-body">
              {totalCals > 0 ? `${pcts[i]}%` : "—"}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
