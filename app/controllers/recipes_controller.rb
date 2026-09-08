# frozen_string_literal: true

class RecipesController < ApplicationController
  before_action :set_recipe, only: %i[show edit update destroy]

  def index
    recipes = Current.user.recipes.includes(:recipe_ingredients).order(created_at: :desc)
    render inertia: "Recipes/Index", props: {
      recipes: recipes.map { |r| serialize_recipe(r) }
    }
  end

  def show
    render inertia: "Recipes/Show", props: {
      recipe: serialize_recipe_detail(@recipe)
    }
  end

  def new
    render inertia: "Recipes/New"
  end

  def create
    @recipe = Current.user.recipes.build(recipe_params)

    if @recipe.valid?
      ActiveRecord::Base.transaction do
        @recipe.save!
        create_ingredients(@recipe, ingredients_params)
      end
      redirect_to recipe_path(@recipe), notice: "Recipe saved."
    else
      redirect_to new_recipe_path,
                  inertia: { errors: @recipe.errors.to_hash(true).transform_values(&:first) }
    end
  rescue ActiveRecord::RecordInvalid
    redirect_to new_recipe_path,
                inertia: { errors: { base: "One or more ingredients have invalid data." } }
  end

  def edit
    render inertia: "Recipes/Edit", props: {
      recipe: serialize_recipe_detail(@recipe)
    }
  end

  def update
    ActiveRecord::Base.transaction do
      @recipe.update!(recipe_params)
      @recipe.recipe_ingredients.destroy_all
      create_ingredients(@recipe, ingredients_params)
    end
    redirect_to recipe_path(@recipe), notice: "Recipe updated."
  rescue ActiveRecord::RecordInvalid
    redirect_to edit_recipe_path(@recipe),
                inertia: { errors: @recipe.errors.to_hash(true).transform_values(&:first) }
  end

  def destroy
    @recipe.destroy!
    redirect_to recipes_path, notice: "Recipe deleted."
  end

  private

  def set_recipe
    @recipe = Current.user.recipes.find(params[:id])
  end

  def recipe_params
    params.permit(:name, :description, :servings, :instructions, :prep_time)
  end

  def ingredients_params
    params.permit(ingredients: %i[food_name quantity unit calories protein_grams fat_grams carbs_grams])
          .fetch(:ingredients, [])
  end

  def create_ingredients(recipe, ingredients)
    ingredients.each do |ing|
      recipe.recipe_ingredients.create!(
        food_name:    ing[:food_name],
        quantity:     ing[:quantity].to_f,
        unit:         ing[:unit],
        calories:     ing[:calories].to_f,
        protein_grams: ing[:protein_grams].to_f,
        fat_grams:    ing[:fat_grams].to_f,
        carbs_grams:  ing[:carbs_grams].to_f
      )
    end
  end

  def serialize_recipe(recipe)
    macros = recipe.per_serving_macros
    {
      id:          recipe.id,
      name:        recipe.name,
      description: recipe.description,
      servings:    recipe.servings,
      prep_time:   recipe.prep_time,
      source:      recipe.source,
      created_at:  recipe.created_at,
      per_serving: macros
    }
  end

  def serialize_recipe_detail(recipe)
    serialize_recipe(recipe).merge(
      instructions: recipe.instructions,
      ingredients:  recipe.recipe_ingredients.map do |i|
        {
          id:            i.id,
          food_name:     i.food_name,
          quantity:      i.quantity.to_f,
          unit:          i.unit,
          calories:      i.calories.to_f,
          protein_grams: i.protein_grams.to_f,
          fat_grams:     i.fat_grams.to_f,
          carbs_grams:   i.carbs_grams.to_f
        }
      end
    )
  end
end
