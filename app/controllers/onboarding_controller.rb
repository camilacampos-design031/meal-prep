# frozen_string_literal: true

class OnboardingController < ApplicationController
  skip_before_action :require_onboarding

  def show
    return redirect_to dashboard_path if Current.user.nutrition_goal.present?
    render inertia: "Onboarding"
  end

  def create
    goal = Current.user.build_nutrition_goal(nutrition_goal_params)

    if goal.save
      redirect_to dashboard_path, notice: "Macros saved!"
    else
      redirect_to onboarding_path,
                  inertia: { errors: goal.errors.to_hash(true).transform_values(&:first) }
    end
  end

  private

  def nutrition_goal_params
    params.permit(:protein_grams, :fat_grams, :carbs_grams)
  end
end
