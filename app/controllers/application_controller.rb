class ApplicationController < ActionController::Base
  include Authentication

  allow_browser versions: :modern

  before_action :require_onboarding

  inertia_share do
    {
      current_user: Current.user && {
        id: Current.user.id,
        email: Current.user.email,
        timezone: Current.user.timezone,
        admin: Current.user.admin?
      },
      flash: {
        notice: flash.notice,
        alert: flash.alert
      },
      nutrition_goal: Current.user&.nutrition_goal&.then do |g|
        { protein_grams: g.protein_grams, fat_grams: g.fat_grams,
          carbs_grams: g.carbs_grams, calories: g.calories }
      end
    }
  end

  private

  def require_onboarding
    return unless authenticated?
    redirect_to onboarding_path if Current.user.nutrition_goal.nil?
  end
end
