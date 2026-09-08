import { FormEvent } from "react"
import { useForm, usePage } from "@inertiajs/react"
import type { PageProps } from "@/types/inertia"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MacroBreakdownBar } from "@/components/MacroBreakdownBar"
import { IngredientRow, type IngredientData } from "@/components/IngredientRow"
import type { Recipe } from "@/types/inertia"

type FormData = {
  name: string
  description: string
  servings: string
  instructions: string
  prep_time: string
  ingredients: IngredientData[]
}

type Props = {
  recipe?: Recipe
}

const EMPTY_INGREDIENT: IngredientData = {
  food_name: "",
  quantity: 100,
  unit: "g",
  calories: 0,
  protein_grams: 0,
  fat_grams: 0,
  carbs_grams: 0,
}

export function RecipeForm({ recipe }: Props) {
  const { props } = usePage<PageProps>()
  const form = useForm<FormData>({
    name:         recipe?.name ?? "",
    description:  recipe?.description ?? "",
    servings:     recipe ? String(recipe.servings) : "1",
    instructions: recipe?.instructions ?? "",
    prep_time:    recipe?.prep_time != null ? String(recipe.prep_time) : "",
    ingredients:  recipe?.ingredients?.map((i) => ({
      food_name:     i.food_name,
      quantity:      i.quantity,
      unit:          i.unit,
      calories:      i.calories,
      protein_grams: i.protein_grams,
      fat_grams:     i.fat_grams,
      carbs_grams:   i.carbs_grams,
    })) ?? [{ ...EMPTY_INGREDIENT }],
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (recipe) {
      form.patch(`/recipes/${recipe.id}`)
    } else {
      form.post("/recipes")
    }
  }

  const addIngredient = () => {
    form.setData("ingredients", [...form.data.ingredients, { ...EMPTY_INGREDIENT }])
  }

  const updateIngredient = (index: number, updates: Partial<IngredientData>) => {
    form.setData(
      "ingredients",
      form.data.ingredients.map((ing, i) => (i === index ? { ...ing, ...updates } : ing))
    )
  }

  const removeIngredient = (index: number) => {
    form.setData(
      "ingredients",
      form.data.ingredients.filter((_, i) => i !== index)
    )
  }

  // Live per-serving macro totals
  const servings = Math.max(parseInt(form.data.servings) || 1, 1)
  const totals = form.data.ingredients.reduce(
    (acc, ing) => ({
      calories:      acc.calories      + (Number(ing.calories)      || 0),
      protein_grams: acc.protein_grams + (Number(ing.protein_grams) || 0),
      fat_grams:     acc.fat_grams     + (Number(ing.fat_grams)     || 0),
      carbs_grams:   acc.carbs_grams   + (Number(ing.carbs_grams)   || 0),
    }),
    { calories: 0, protein_grams: 0, fat_grams: 0, carbs_grams: 0 }
  )
  const perServing = {
    calories:      Math.round(totals.calories      / servings),
    protein_grams: +((totals.protein_grams / servings).toFixed(1)),
    fat_grams:     +((totals.fat_grams     / servings).toFixed(1)),
    carbs_grams:   +((totals.carbs_grams   / servings).toFixed(1)),
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* Basic info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-2">
          <label htmlFor="recipe-name">Name</label>
          <Input
            id="recipe-name"
            required
            autoFocus
            value={form.data.name}
            onChange={(e) => form.setData("name", e.target.value)}
            aria-describedby={form.errors.name ? "recipe-name-error" : undefined}
          />
          {form.errors.name && (
            <p id="recipe-name-error" className="text-xs text-danger-display">
              {form.errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="recipe-servings">Servings</label>
          <Input
            id="recipe-servings"
            type="number"
            min="1"
            step="1"
            required
            value={form.data.servings}
            onChange={(e) => form.setData("servings", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="recipe-prep-time">Prep time (min) <span className="text-ink-muted font-normal">(optional)</span></label>
          <Input
            id="recipe-prep-time"
            type="number"
            min="0"
            step="1"
            value={form.data.prep_time}
            onChange={(e) => form.setData("prep_time", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <label htmlFor="recipe-description">Description <span className="text-ink-muted font-normal">(optional)</span></label>
          <Input
            id="recipe-description"
            value={form.data.description}
            onChange={(e) => form.setData("description", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <label htmlFor="recipe-instructions">Instructions <span className="text-ink-muted font-normal">(optional)</span></label>
          <textarea
            id="recipe-instructions"
            rows={4}
            className="w-full rounded-md border border-hairline bg-page px-3 py-2 text-sm text-ink-body placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
            value={form.data.instructions}
            onChange={(e) => form.setData("instructions", e.target.value)}
          />
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2>Ingredients</h2>
          <button
            type="button"
            onClick={addIngredient}
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80"
          >
            <Plus className="h-4 w-4" />
            Add ingredient
          </button>
        </div>

        {form.data.ingredients.length === 0 ? (
          <p className="rounded-lg border border-dashed border-hairline p-6 text-center text-sm text-ink-muted">
            No ingredients yet. Add one to start calculating macros.
          </p>
        ) : (
          <div className="space-y-2">
            {form.data.ingredients.map((ing, i) => (
              <IngredientRow
                key={i}
                ingredient={ing}
                index={i}
                onChange={(updates) => updateIngredient(i, updates)}
                onRemove={() => removeIngredient(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Macro summary */}
      <div className="rounded-lg border border-hairline bg-surface p-4 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-ink-muted">
            Per serving ({servings} {servings === 1 ? "serving" : "servings"})
          </span>
          <span className="text-2xl font-semibold text-ink-display tabular-nums">
            {perServing.calories > 0 ? `${perServing.calories} kcal` : "—"}
          </span>
        </div>
        {perServing.calories > 0 && (
          <MacroBreakdownBar
            proteinGrams={perServing.protein_grams}
            fatGrams={perServing.fat_grams}
            carbsGrams={perServing.carbs_grams}
          />
        )}
        {perServing.calories > 0 && (
          <div className="grid grid-cols-3 gap-2 pt-1 text-sm">
            <div>
              <span className="text-ink-muted">Protein</span>
              <span className="ml-1 font-medium text-ink-body">{perServing.protein_grams}g</span>
            </div>
            <div>
              <span className="text-ink-muted">Fat</span>
              <span className="ml-1 font-medium text-ink-body">{perServing.fat_grams}g</span>
            </div>
            <div>
              <span className="text-ink-muted">Carbs</span>
              <span className="ml-1 font-medium text-ink-body">{perServing.carbs_grams}g</span>
            </div>
          </div>
        )}
      </div>

      {props.errors?.base && (
        <p className="text-sm text-danger-display">{props.errors.base}</p>
      )}

      <Button type="submit" disabled={form.processing} className="w-full sm:w-auto">
        {recipe ? "Save changes" : "Save recipe"}
      </Button>
    </form>
  )
}
