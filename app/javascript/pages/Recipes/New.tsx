import { Head } from "@inertiajs/react"
import { AppShell } from "@/components/AppShell"
import { RecipeForm } from "@/components/RecipeForm"

export default function RecipesNew() {
  return (
    <>
      <Head title="New Recipe">
        <meta name="description" content="Create a new recipe and track its macros per serving." />
        <meta property="og:title" content="New Recipe" />
        <meta property="og:description" content="Create a new recipe and track its macros per serving." />
      </Head>
      <AppShell>
        <h1>New recipe</h1>
        <div className="mt-8 max-w-2xl">
          <RecipeForm />
        </div>
      </AppShell>
    </>
  )
}
