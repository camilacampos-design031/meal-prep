# frozen_string_literal: true

class CreateNutritionGoals < ActiveRecord::Migration[8.0]
  def change
    create_table :nutrition_goals do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.integer :protein_grams, null: false
      t.integer :fat_grams, null: false
      t.integer :carbs_grams, null: false
      t.integer :calories, null: false, default: 0

      t.timestamps
    end
  end
end
