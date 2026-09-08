require "test_helper"

class RecipesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @password = "password"
    post login_path, params: { email: @user.email, password: @password }
    @recipe = recipes(:chicken_salad)
  end

  # INDEX

  test "index lists user's recipes" do
    get recipes_path
    assert_response :success
  end

  test "index does not show another user's recipes" do
    other = recipes(:protein_shake)
    other.update!(user: users(:two))
    get recipes_path
    assert_response :success
  end

  # SHOW

  test "show renders recipe detail" do
    get recipe_path(@recipe)
    assert_response :success
  end

  test "show returns 404 for another user's recipe" do
    other_recipe = Recipe.create!(
      user: users(:two), name: "Other", servings: 1, source: "manual"
    )
    get recipe_path(other_recipe)
    assert_response :not_found
  end

  # NEW

  test "new renders create form" do
    get new_recipe_path
    assert_response :success
  end

  # CREATE

  test "create saves recipe with ingredients and redirects to show" do
    assert_difference -> { Recipe.count }, 1 do
      assert_difference -> { RecipeIngredient.count }, 1 do
        post recipes_path, params: {
          name: "Oatmeal",
          servings: 1,
          ingredients: [
            { food_name: "Oats", quantity: 80, unit: "g",
              calories: 300, protein_grams: 10, fat_grams: 5, carbs_grams: 54 }
          ]
        }
      end
    end
    assert_redirected_to recipe_path(Recipe.last)
  end

  test "create with missing name redirects back with errors" do
    assert_no_difference -> { Recipe.count } do
      post recipes_path, params: { name: "", servings: 1 }
    end
    assert_redirected_to new_recipe_path
  end

  # EDIT

  test "edit renders edit form" do
    get edit_recipe_path(@recipe)
    assert_response :success
  end

  # UPDATE

  test "update changes recipe name and redirects to show" do
    patch recipe_path(@recipe), params: {
      name: "Updated Salad",
      servings: 2,
      ingredients: [
        { food_name: "Chicken", quantity: 150, unit: "g",
          calories: 165, protein_grams: 31, fat_grams: 3.6, carbs_grams: 0 }
      ]
    }
    assert_redirected_to recipe_path(@recipe)
    assert_equal "Updated Salad", @recipe.reload.name
  end

  test "update replaces ingredients atomically" do
    patch recipe_path(@recipe), params: {
      name: @recipe.name,
      servings: @recipe.servings,
      ingredients: [
        { food_name: "Only Ingredient", quantity: 100, unit: "g",
          calories: 100, protein_grams: 10, fat_grams: 5, carbs_grams: 10 }
      ]
    }
    assert_equal 1, @recipe.reload.recipe_ingredients.count
    assert_equal "Only Ingredient", @recipe.recipe_ingredients.first.food_name
  end

  # DESTROY

  test "destroy deletes recipe and redirects to index" do
    assert_difference -> { Recipe.count }, -1 do
      delete recipe_path(@recipe)
    end
    assert_redirected_to recipes_path
  end

  test "destroy returns 404 for another user's recipe" do
    other = Recipe.create!(user: users(:two), name: "Other", servings: 1, source: "manual")
    assert_no_difference -> { Recipe.count } do
      delete recipe_path(other)
      assert_response :not_found
    end
  end
end
