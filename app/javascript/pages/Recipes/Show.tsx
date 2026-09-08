import { Head, Link, router, usePage } from "@inertiajs/react"
import { Pencil, Trash2 } from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { Button } from "@/components/ui/button"
import { MacroBreakdownBar } from "@/components/MacroBreakdownBar"
import type { PageProps, Recipe } from "@/types/inertia"

type Props = PageProps<{ recipe: Recipe }>

export default function RecipesShow() {
  const { props } = usePage<Props>()
  const { recipe } = props

  function handleDelete() {
    if (!confirm(`Delete "${recipe.name}"? This cannot be undone.`)) return
    router.delete(`/recipes/${recipe.id}`)
  }

  const ps = recipe.per_serving

  return (
    <>
      <Head title={recipe.name}>
        <meta
          name="description"
          content={recipe.description ?? `${recipe.name} — ${Math.round(ps.calories)} kcal per serving.`}
        />
        <meta property="og:title" content={recipe.name} />
        <meta
          property="og:description"
          content={recipe.description ?? `${recipe.name} — ${Math.round(ps.calories)} kcal per serving.`}
        />
      </Head>
      <AppShell>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1>{recipe.name}</h1>
            {recipe.description && (
              <p className="mt-1 text-ink-muted">{recipe.description}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href={`/recipes/${recipe.id}/edit`}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Link>
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDelete} className="text-danger-display hover:bg-danger/10">
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>

        {props.flash?.notice && (
          <p className="mt-3 text-sm text-accent">{props.flash.notice}</p>
        )}

        {/* Meta */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-muted">
          <span>{recipe.servings} {recipe.servings === 1 ? "serving" : "servings"}</span>
          {recipe.prep_time != null && <span>{recipe.prep_time} min prep</span>}
        </div>

        {/* Per-serving macros */}
        <div className="mt-6 rounded-xl border border-hairline bg-surface p-4 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-ink-muted">Per serving</span>
            <span className="text-2xl font-semibold text-ink-display tabular-nums">
              {Math.round(ps.calories)} kcal
            </span>
          </div>
          <MacroBreakdownBar
            proteinGrams={ps.protein_grams}
            fatGrams={ps.fat_grams}
            carbsGrams={ps.carbs_grams}
          />
          <div className="grid grid-cols-3 gap-2 pt-1 text-sm">
            <div>
              <span className="text-ink-muted">Protein</span>
              <span className="ml-1 font-medium text-ink-body">{ps.protein_grams}g</span>
            </div>
            <div>
              <span className="text-ink-muted">Fat</span>
              <span className="ml-1 font-medium text-ink-body">{ps.fat_grams}g</span>
            </div>
            <div>
              <span className="text-ink-muted">Carbs</span>
              <span className="ml-1 font-medium text-ink-body">{ps.carbs_grams}g</span>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="mt-8">
            <h2>Ingredients</h2>
            <div className="mt-3 overflow-x-auto rounded-xl border border-hairline">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-surface text-left text-ink-muted">
                    <th className="px-4 py-2 font-medium">Ingredient</th>
                    <th className="px-4 py-2 font-medium text-right">Qty</th>
                    <th className="px-4 py-2 font-medium text-right">Calories</th>
                    <th className="px-4 py-2 font-medium text-right">Protein</th>
                    <th className="px-4 py-2 font-medium text-right">Fat</th>
                    <th className="px-4 py-2 font-medium text-right">Carbs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {recipe.ingredients.map((ing) => (
                    <tr key={ing.id} className="hover:bg-surface/50">
                      <td className="px-4 py-2 text-ink-display">{ing.food_name}</td>
                      <td className="px-4 py-2 text-right text-ink-muted tabular-nums">
                        {ing.quantity}{ing.unit}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">{Math.round(ing.calories)}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{ing.protein_grams}g</td>
                      <td className="px-4 py-2 text-right tabular-nums">{ing.fat_grams}g</td>
                      <td className="px-4 py-2 text-right tabular-nums">{ing.carbs_grams}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && (
          <div className="mt-8">
            <h2>Instructions</h2>
            <div className="mt-3 whitespace-pre-wrap text-ink-body leading-relaxed">
              {recipe.instructions}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href="/recipes" className="text-sm text-ink-muted hover:text-ink-body">
            ← Back to recipes
          </Link>
        </div>
      </AppShell>
    </>
  )
}
