import { Head, usePage } from "@inertiajs/react"
import { AppShell } from "@/components/AppShell"
import { RecipeForm } from "@/components/RecipeForm"
import type { PageProps, Recipe } from "@/types/inertia"

type Props = PageProps<{ recipe: Recipe }>

export default function RecipesEdit() {
  const { props } = usePage<Props>()

  return (
    <>
      <Head title="Edit Recipe">
        <meta name="description" content="Edit your recipe and update its macro information." />
        <meta property="og:title" content="Edit Recipe" />
        <meta property="og:description" content="Edit your recipe and update its macro information." />
      </Head>
      <AppShell>
        <h1>Edit recipe</h1>
        <div className="mt-8 max-w-2xl">
          <RecipeForm recipe={props.recipe} />
        </div>
      </AppShell>
    </>
  )
}
