import type { PageProps as InertiaPageProps } from "@inertiajs/core"

export type CurrentUser = {
  id: number
  email: string
  timezone: string | null
  admin: boolean
} | null

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
