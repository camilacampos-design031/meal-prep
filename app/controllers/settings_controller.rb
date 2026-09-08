class SettingsController < ApplicationController
  def show
    goal = Current.user.nutrition_goal
    render inertia: "Settings", props: {
      nutrition_goal: goal && {
        protein_grams: goal.protein_grams,
        fat_grams: goal.fat_grams,
        carbs_grams: goal.carbs_grams,
        calories: goal.calories
      }
    }
  end
end
