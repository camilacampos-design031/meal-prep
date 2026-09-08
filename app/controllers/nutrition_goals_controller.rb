# frozen_string_literal: true

class NutritionGoalsController < ApplicationController
  def update
    goal = Current.user.nutrition_goal || Current.user.build_nutrition_goal

    if goal.update(nutrition_goal_params)
      redirect_to settings_path, notice: "Macros updated."
    else
      redirect_to settings_path,
                  inertia: { errors: goal.errors.to_hash(true).transform_values(&:first) }
    end
  end

  private

  def nutrition_goal_params
    params.permit(:protein_grams, :fat_grams, :carbs_grams)
  end
end
