import { useState } from "react"
import { Head, Link, usePage } from "@inertiajs/react"
import { ChefHat, Plus } from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PageProps, Recipe } from "@/types/inertia"

type Props = PageProps<{ recipes: Recipe[] }>

export default function RecipesIndex() {
  const { props } = usePage<Props>()
  const [search, setSearch] = useState("")

  const filtered = props.recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Head title="Recipes">
        <meta name="description" content="Browse and manage your personal recipe library." />
        <meta property="og:title" content="Recipes" />
        <meta property="og:description" content="Browse and manage your personal recipe library." />
      </Head>
      <AppShell>
        <div className="flex items-center justify-between gap-4">
          <h1>Recipes</h1>
          <Button asChild>
            <Link href="/recipes/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New recipe
            </Link>
          </Button>
        </div>

        {props.flash?.notice && (
          <p className="mt-3 text-sm text-accent">{props.flash.notice}</p>
        )}

        {props.recipes.length > 0 && (
          <div className="mt-4 max-w-sm">
            <Input
              placeholder="Search recipes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search recipes"
            />
          </div>
        )}

        <div className="mt-6">
          {props.recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hairline py-16 text-center">
              <ChefHat className="h-10 w-10 text-ink-muted" />
              <h2 className="mt-4">No recipes yet</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Create your first recipe to start tracking macros.
              </p>
              <Button asChild className="mt-6">
                <Link href="/recipes/new">
                  <Plus className="mr-1.5 h-4 w-4" />
                  New recipe
                </Link>
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-ink-muted">No recipes match "{search}".</p>
          ) : (
            <ul className="divide-y divide-hairline rounded-xl border border-hairline">
              {filtered.map((recipe) => (
                <li key={recipe.id}>
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-surface no-underline transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-ink-display truncate">{recipe.name}</p>
                      {recipe.description && (
                        <p className="mt-0.5 text-sm text-ink-muted truncate">{recipe.description}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-ink-display tabular-nums">
                        {Math.round(recipe.per_serving.calories)} kcal
                      </p>
                      <p className="text-xs text-ink-muted">
                        P {recipe.per_serving.protein_grams}g &middot; F {recipe.per_serving.fat_grams}g &middot; C {recipe.per_serving.carbs_grams}g
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </AppShell>
    </>
  )
}
