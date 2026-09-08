import { FormEvent } from "react"
import { Head, useForm, usePage } from "@inertiajs/react"
import { AuthShell } from "@/components/AuthShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MacroBreakdownBar } from "@/components/MacroBreakdownBar"
import type { PageProps } from "@/types/inertia"

export default function Onboarding() {
  const { props } = usePage<PageProps>()
  const form = useForm({
    protein_grams: "",
    fat_grams: "",
    carbs_grams: "",
  })

  const protein = parseInt(form.data.protein_grams) || 0
  const fat = parseInt(form.data.fat_grams) || 0
  const carbs = parseInt(form.data.carbs_grams) || 0
  const calories = protein * 4 + fat * 9 + carbs * 4

  const submit = (e: FormEvent) => {
    e.preventDefault()
    form.post("/onboarding")
  }

  return (
    <>
      <Head title="Set Up Your Macros">
        <meta name="description" content="Set your daily macronutrient targets to get started." />
        <meta property="og:title" content="Set Up Your Macros" />
        <meta property="og:description" content="Set your daily macronutrient targets to get started." />
      </Head>
      <AuthShell>
        <div className="text-center">
          <h2>Set up your macros</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Enter your daily protein, fat, and carb targets. Calories are calculated automatically.
          </p>
        </div>

        {props.flash?.notice && (
          <p className="mt-4 text-center text-sm text-accent">{props.flash.notice}</p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label htmlFor="protein_grams">Protein (g)</label>
              <Input
                id="protein_grams"
                type="number"
                min="0"
                step="1"
                autoFocus
                required
                value={form.data.protein_grams}
                onChange={(e) => form.setData("protein_grams", e.target.value)}
                aria-describedby={form.errors.protein_grams ? "protein-error" : undefined}
              />
              {form.errors.protein_grams && (
                <p id="protein-error" className="text-xs text-danger-display">
                  {form.errors.protein_grams}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="fat_grams">Fat (g)</label>
              <Input
                id="fat_grams"
                type="number"
                min="0"
                step="1"
                required
                value={form.data.fat_grams}
                onChange={(e) => form.setData("fat_grams", e.target.value)}
                aria-describedby={form.errors.fat_grams ? "fat-error" : undefined}
              />
              {form.errors.fat_grams && (
                <p id="fat-error" className="text-xs text-danger-display">
                  {form.errors.fat_grams}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="carbs_grams">Carbs (g)</label>
              <Input
                id="carbs_grams"
                type="number"
                min="0"
                step="1"
                required
                value={form.data.carbs_grams}
                onChange={(e) => form.setData("carbs_grams", e.target.value)}
                aria-describedby={form.errors.carbs_grams ? "carbs-error" : undefined}
              />
              {form.errors.carbs_grams && (
                <p id="carbs-error" className="text-xs text-danger-display">
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

          <Button type="submit" disabled={form.processing} className="w-full">
            Save macros
          </Button>
        </form>
      </AuthShell>
    </>
  )
}
