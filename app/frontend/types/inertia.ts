import type { PageProps as InertiaPageProps } from "@inertiajs/core"

export type CurrentUser = {
  id: number
  email: string
  timezone: string | null
  admin: boolean
} | null

export type RecipeMacros = {
  calories: number
  protein_grams: number
  fat_grams: number
  carbs_grams: number
}

export type RecipeIngredient = {
  id: number
  food_name: string
  quantity: number
  unit: string
  calories: number
  protein_grams: number
  fat_grams: number
  carbs_grams: number
}

export type Recipe = {
  id: number
  name: string
  description: string | null
  servings: number
  prep_time: number | null
  source: string
  created_at: string
  per_serving: RecipeMacros
  instructions?: string | null
  ingredients?: RecipeIngredient[]
}

export type NutritionGoal = {
  protein_grams: number
  fat_grams: number
  carbs_grams: number
  calories: number
} | null

export type SharedProps = {
  current_user: CurrentUser
  flash: {
    notice: string | null
    alert: string | null
  }
  errors: Record<string, string>
  nutrition_goal: NutritionGoal
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> =
  SharedProps & T & InertiaPageProps
