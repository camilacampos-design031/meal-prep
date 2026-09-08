require "test_helper"

class NutritionGoalTest < ActiveSupport::TestCase
  test "calculates calories from macros before save" do
    # Use the fixture goal to avoid uniqueness conflict
    goal = nutrition_goals(:one)
    goal.update!(protein_grams: 150, fat_grams: 60, carbs_grams: 200)
    # protein 150*4=600, fat 60*9=540, carbs 200*4=800 → 1940
    assert_equal 1940, goal.reload.calories
  end

  test "updates calories when macros change" do
    goal = nutrition_goals(:one)
    goal.update!(protein_grams: 200, fat_grams: 80, carbs_grams: 250)
    # 200*4 + 80*9 + 250*4 = 800 + 720 + 1000 = 2520
    assert_equal 2520, goal.calories
  end

  test "requires protein_grams" do
    goal = NutritionGoal.new(fat_grams: 50, carbs_grams: 150)
    assert_not goal.valid?
    assert_includes goal.errors[:protein_grams], "can't be blank"
  end

  test "requires fat_grams" do
    goal = NutritionGoal.new(protein_grams: 100, carbs_grams: 150)
    assert_not goal.valid?
    assert_includes goal.errors[:fat_grams], "can't be blank"
  end

  test "requires carbs_grams" do
    goal = NutritionGoal.new(protein_grams: 100, fat_grams: 50)
    assert_not goal.valid?
    assert_includes goal.errors[:carbs_grams], "can't be blank"
  end

  test "rejects negative macros" do
    goal = nutrition_goals(:one)
    goal.protein_grams = -10
    assert_not goal.valid?
    assert_includes goal.errors[:protein_grams], "must be greater than or equal to 0"
  end

  test "allows zero macros" do
    goal = nutrition_goals(:one)
    goal.update!(protein_grams: 0, fat_grams: 0, carbs_grams: 0)
    assert_equal 0, goal.reload.calories
  end
end
