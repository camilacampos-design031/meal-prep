import { useEffect, useRef, useState } from "react"
import { Loader2, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type IngredientData = {
  food_name: string
  quantity: number | string
  unit: string
  calories: number | string
  protein_grams: number | string
  fat_grams: number | string
  carbs_grams: number | string
}

type USDAResult = {
  food_name: string
  calories_per_100g: number
  protein_per_100g: number
  fat_per_100g: number
  carbs_per_100g: number
}

type Props = {
  ingredient: IngredientData
  index: number
  onChange: (updates: Partial<IngredientData>) => void
  onRemove: () => void
}

type Tab = "manual" | "search"

export function IngredientRow({ ingredient, index, onChange, onRemove }: Props) {
  const [tab, setTab] = useState<Tab>("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<USDAResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFood, setSelectedFood] = useState<USDAResult | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Debounced USDA search
  useEffect(() => {
    if (tab !== "search") return
    if (searchQuery.trim().length < 2) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/foods/search?q=${encodeURIComponent(searchQuery.trim())}`)
        const data: USDAResult[] = await res.json()
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, tab])

  function selectFood(food: USDAResult) {
    const qty = Number(ingredient.quantity) || 100
    const factor = qty / 100
    setSelectedFood(food)
    setResults([])
    onChange({
      food_name:     food.food_name,
      unit:          "g",
      calories:      +(food.calories_per_100g * factor).toFixed(1),
      protein_grams: +(food.protein_per_100g  * factor).toFixed(1),
      fat_grams:     +(food.fat_per_100g      * factor).toFixed(1),
      carbs_grams:   +(food.carbs_per_100g    * factor).toFixed(1),
    })
  }

  function handleQuantityChange(qty: string) {
    if (selectedFood) {
      const factor = (Number(qty) || 0) / 100
      onChange({
        quantity:      qty,
        calories:      +(selectedFood.calories_per_100g * factor).toFixed(1),
        protein_grams: +(selectedFood.protein_per_100g  * factor).toFixed(1),
        fat_grams:     +(selectedFood.fat_per_100g      * factor).toFixed(1),
        carbs_grams:   +(selectedFood.carbs_per_100g    * factor).toFixed(1),
      })
    } else {
      onChange({ quantity: qty })
    }
  }

  function clearSelectedFood() {
    setSelectedFood(null)
    setSearchQuery("")
    setResults([])
    setTimeout(() => searchRef.current?.focus(), 50)
  }

  function switchTab(t: Tab) {
    setTab(t)
    if (t === "search") {
      setSelectedFood(null)
      setSearchQuery(ingredient.food_name || "")
      setResults([])
    }
  }

  return (
    <div className="rounded-lg border border-hairline bg-surface overflow-hidden">
      {/* Tab bar + remove button */}
      <div className="flex items-center border-b border-hairline">
        <div className="flex flex-1">
          {(["search", "manual"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              className={cn(
                "px-4 py-2 text-sm font-medium capitalize transition-colors",
                tab === t
                  ? "border-b-2 border-accent text-ink-display -mb-px"
                  : "text-ink-muted hover:text-ink-body"
              )}
            >
              {t === "search" ? "Search USDA" : "Manual"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-page hover:text-danger-display"
          aria-label="Remove ingredient"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* ── SEARCH TAB ── */}
        {tab === "search" && !selectedFood && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
              <Input
                ref={searchRef}
                placeholder="Search for a food (e.g. chicken breast, oats…)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
                autoComplete="off"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-ink-muted" />
              )}
            </div>

            {/* Results list */}
            {results.length > 0 && (
              <ul className="divide-y divide-hairline rounded-lg border border-hairline overflow-hidden">
                {results.map((food, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => selectFood(food)}
                      className="w-full px-3 py-2.5 text-left hover:bg-page transition-colors"
                    >
                      <p className="text-sm font-medium text-ink-display">{food.food_name}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {food.calories_per_100g} kcal &middot; P {food.protein_per_100g}g &middot; F {food.fat_per_100g}g &middot; C {food.carbs_per_100g}g
                        <span className="ml-1 text-ink-muted/60">per 100g</span>
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!isLoading && searchQuery.length >= 2 && results.length === 0 && (
              <p className="text-sm text-ink-muted text-center py-2">
                No results for "{searchQuery}".{" "}
                <button type="button" className="text-accent underline" onClick={() => switchTab("manual")}>
                  Enter manually
                </button>
              </p>
            )}

            {searchQuery.length === 0 && (
              <p className="text-xs text-ink-muted text-center py-1">
                Type at least 2 characters to search.{" "}
                <button type="button" className="text-accent underline" onClick={() => switchTab("manual")}>
                  Or enter manually
                </button>
              </p>
            )}
          </>
        )}

        {/* ── SEARCH TAB: food selected ── */}
        {tab === "search" && selectedFood && (
          <>
            <div className="flex items-start justify-between gap-2 rounded-md border border-hairline bg-page px-3 py-2">
              <div>
                <p className="text-sm font-medium text-ink-display">{selectedFood.food_name}</p>
                <p className="text-xs text-ink-muted">
                  {selectedFood.calories_per_100g} kcal &middot; P {selectedFood.protein_per_100g}g &middot; F {selectedFood.fat_per_100g}g &middot; C {selectedFood.carbs_per_100g}g per 100g
                </p>
              </div>
              <button
                type="button"
                onClick={clearSelectedFood}
                className="text-xs text-accent hover:underline shrink-0"
              >
                Change
              </button>
            </div>

            {/* Quantity + auto-calculated macros */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="space-y-1">
                <label htmlFor={`ing-qty-${index}`} className="text-xs text-ink-muted">Quantity (g)</label>
                <Input
                  id={`ing-qty-${index}`}
                  type="number"
                  min="0"
                  step="any"
                  autoFocus
                  value={String(ingredient.quantity)}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-ink-muted">Calories</p>
                <p className="h-9 flex items-center text-sm font-medium text-ink-display tabular-nums">
                  {Number(ingredient.calories).toFixed(1)} kcal
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-ink-muted">Protein</p>
                <p className="h-9 flex items-center text-sm font-medium text-ink-display tabular-nums">
                  {Number(ingredient.protein_grams).toFixed(1)}g
                </p>
              </div>
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <p className="text-xs text-ink-muted">Fat / Carbs</p>
                <p className="h-9 flex items-center text-sm font-medium text-ink-display tabular-nums">
                  {Number(ingredient.fat_grams).toFixed(1)}g / {Number(ingredient.carbs_grams).toFixed(1)}g
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── MANUAL TAB ── */}
        {tab === "manual" && (
          <>
            <div className="space-y-1">
              <label htmlFor={`ing-name-${index}`} className="text-xs text-ink-muted">Food name</label>
              <Input
                id={`ing-name-${index}`}
                autoFocus
                placeholder="e.g. Brown rice, cooked"
                value={ingredient.food_name}
                onChange={(e) => onChange({ food_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
              <div className="space-y-1">
                <label htmlFor={`ing-qty-m-${index}`} className="text-xs text-ink-muted">Quantity</label>
                <Input
                  id={`ing-qty-m-${index}`}
                  type="number" min="0" step="any" placeholder="100"
                  value={String(ingredient.quantity)}
                  onChange={(e) => onChange({ quantity: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`ing-unit-m-${index}`} className="text-xs text-ink-muted">Unit</label>
                <Input
                  id={`ing-unit-m-${index}`}
                  placeholder="g"
                  value={ingredient.unit}
                  onChange={(e) => onChange({ unit: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`ing-cal-m-${index}`} className="text-xs text-ink-muted">Calories</label>
                <Input
                  id={`ing-cal-m-${index}`}
                  type="number" min="0" step="any" placeholder="0"
                  value={String(ingredient.calories)}
                  onChange={(e) => onChange({ calories: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`ing-prot-m-${index}`} className="text-xs text-ink-muted">Protein (g)</label>
                <Input
                  id={`ing-prot-m-${index}`}
                  type="number" min="0" step="any" placeholder="0"
                  value={String(ingredient.protein_grams)}
                  onChange={(e) => onChange({ protein_grams: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`ing-fat-m-${index}`} className="text-xs text-ink-muted">Fat (g)</label>
                <Input
                  id={`ing-fat-m-${index}`}
                  type="number" min="0" step="any" placeholder="0"
                  value={String(ingredient.fat_grams)}
                  onChange={(e) => onChange({ fat_grams: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`ing-carbs-m-${index}`} className="text-xs text-ink-muted">Carbs (g)</label>
                <Input
                  id={`ing-carbs-m-${index}`}
                  type="number" min="0" step="any" placeholder="0"
                  value={String(ingredient.carbs_grams)}
                  onChange={(e) => onChange({ carbs_grams: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
