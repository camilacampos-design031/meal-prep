import { FormEvent } from "react"
import { Head, useForm, usePage } from "@inertiajs/react"
import { AppShell } from "@/components/AppShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MacroBreakdownBar } from "@/components/MacroBreakdownBar"
import type { NutritionGoal, PageProps } from "@/types/inertia"

type Props = PageProps<{ nutrition_goal: NutritionGoal }>

export default function Settings() {
  const { props } = usePage<Props>()
  const goal = props.nutrition_goal

  const form = useForm({
    protein_grams: goal ? String(goal.protein_grams) : "",
    fat_grams: goal ? String(goal.fat_grams) : "",
    carbs_grams: goal ? String(goal.carbs_grams) : "",
  })

  const protein = parseInt(form.data.protein_grams) || 0
  const fat = parseInt(form.data.fat_grams) || 0
  const carbs = parseInt(form.data.carbs_grams) || 0
  const calories = protein * 4 + fat * 9 + carbs * 4

  const submit = (e: FormEvent) => {
    e.preventDefault()
    form.patch("/nutrition_goal")
  }

  return (
    <>
      <Head title="Macro Goals">
        <meta name="description" content="Edit your daily protein, fat, and carb targets." />
        <meta property="og:title" content="Macro Goals" />
        <meta property="og:description" content="Edit your daily protein, fat, and carb targets." />
      </Head>
      <AppShell>
        <h1>Macro Goals</h1>

        {props.flash?.notice && (
          <p className="mt-3 text-sm text-accent">{props.flash.notice}</p>
        )}

        <div className="mt-8 max-w-lg space-y-6">
          <div>
            <h2>Daily targets</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Set how many grams of protein, fat, and carbs you want to eat per day.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label htmlFor="settings-protein">Protein (g)</label>
                <Input
                  id="settings-protein"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={form.data.protein_grams}
                  onChange={(e) => form.setData("protein_grams", e.target.value)}
                  aria-describedby={form.errors.protein_grams ? "settings-protein-error" : undefined}
                />
                {form.errors.protein_grams && (
                  <p id="settings-protein-error" className="text-xs text-danger-display">
                    {form.errors.protein_grams}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="settings-fat">Fat (g)</label>
                <Input
                  id="settings-fat"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={form.data.fat_grams}
                  onChange={(e) => form.setData("fat_grams", e.target.value)}
                  aria-describedby={form.errors.fat_grams ? "settings-fat-error" : undefined}
                />
                {form.errors.fat_grams && (
                  <p id="settings-fat-error" className="text-xs text-danger-display">
                    {form.errors.fat_grams}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="settings-carbs">Carbs (g)</label>
                <Input
                  id="settings-carbs"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={form.data.carbs_grams}
                  onChange={(e) => form.setData("carbs_grams", e.target.value)}
                  aria-describedby={form.errors.carbs_grams ? "settings-carbs-error" : undefined}
                />
                {form.errors.carbs_grams && (
                  <p id="settings-carbs-error" className="text-xs text-danger-display">
                    {form.errors.carbs_grams}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-hairline bg-surface p-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-muted">Total daily calories</span>
                <span className="text-2xl font-semibold text-ink-display tabular-nums">
                  {calories > 0 ? calories.toLocaleString() : "—"}
                </span>
              </div>
              <MacroBreakdownBar
                proteinGrams={protein}
                fatGrams={fat}
                carbsGrams={carbs}
              />
            </div>

            <Button type="submit" disabled={form.processing}>
              Save changes
            </Button>
          </form>
        </div>
      </AppShell>
    </>
  )
}
