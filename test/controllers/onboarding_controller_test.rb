require "test_helper"

class OnboardingControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:two) # :two has no nutrition_goal initially in these tests
    @password = "password"
  end

  test "unauthenticated users are redirected to login" do
    get onboarding_path
    assert_redirected_to login_path
  end

  test "authenticated user without macros can view onboarding" do
    @user.nutrition_goal&.destroy
    post login_path, params: { email: @user.email, password: @password }
    get onboarding_path
    assert_response :success
  end

  test "authenticated user with macros is redirected to dashboard from onboarding" do
    post login_path, params: { email: @user.email, password: @password }
    # user :two has a nutrition_goal fixture
    get onboarding_path
    assert_redirected_to dashboard_path
  end

  test "creates nutrition goal and redirects to dashboard" do
    @user.nutrition_goal&.destroy
    post login_path, params: { email: @user.email, password: @password }

    assert_difference -> { NutritionGoal.count }, 1 do
      post onboarding_path, params: {
        protein_grams: 150, fat_grams: 60, carbs_grams: 200
      }
    end

    assert_redirected_to dashboard_path
    assert_equal 1940, @user.reload.nutrition_goal.calories
  end

  test "redirects back with errors on invalid input" do
    @user.nutrition_goal&.destroy
    post login_path, params: { email: @user.email, password: @password }

    assert_no_difference -> { NutritionGoal.count } do
      post onboarding_path, params: {
        protein_grams: -5, fat_grams: 60, carbs_grams: 200
      }
    end

    assert_redirected_to onboarding_path
  end

  test "user without macros is redirected to onboarding when accessing dashboard" do
    @user.nutrition_goal&.destroy
    post login_path, params: { email: @user.email, password: @password }
    get dashboard_path
    assert_redirected_to onboarding_path
  end
end
