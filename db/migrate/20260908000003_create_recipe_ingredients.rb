# frozen_string_literal: true

class CreateRecipeIngredients < ActiveRecord::Migration[8.0]
  def change
    create_table :recipe_ingredients do |t|
      t.references :recipe, null: false, foreign_key: true
      t.string :food_name, null: false
      t.decimal :quantity, null: false, precision: 10, scale: 2
      t.string :unit, null: false
      t.decimal :calories, precision: 10, scale: 2, default: 0
      t.decimal :protein_grams, precision: 10, scale: 2, default: 0
      t.decimal :fat_grams, precision: 10, scale: 2, default: 0
      t.decimal :carbs_grams, precision: 10, scale: 2, default: 0

      t.timestamps
    end
  end
end
