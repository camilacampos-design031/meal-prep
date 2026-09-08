require "test_helper"

class NutritionGoalsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @password = "password"
    post login_path, params: { email: @user.email, password: @password }
  end

  test "updates nutrition goal and redirects to settings" do
    patch nutrition_goal_path, params: {
      protein_grams: 180, fat_grams: 70, carbs_grams: 230
    }

    assert_redirected_to settings_path
    goal = @user.reload.nutrition_goal
    assert_equal 180, goal.protein_grams
    assert_equal 70, goal.fat_grams
    assert_equal 230, goal.carbs_grams
    # 180*4 + 70*9 + 230*4 = 720 + 630 + 920 = 2270
    assert_equal 2270, goal.calories
  end

  test "redirects back to settings with errors on invalid input" do
    patch nutrition_goal_path, params: {
      protein_grams: -10, fat_grams: 70, carbs_grams: 230
    }

    assert_redirected_to settings_path
    assert_equal 150, @user.reload.nutrition_goal.protein_grams # unchanged
  end
end
