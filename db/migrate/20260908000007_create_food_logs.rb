# frozen_string_literal: true

class CreateFoodLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :food_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.references :saved_food, null: true, foreign_key: true
      t.date :date, null: false
      t.string :description, null: false
      t.string :meal_type
      t.decimal :calories, precision: 10, scale: 2, null: false, default: 0
      t.decimal :protein_grams, precision: 10, scale: 2, null: false, default: 0
      t.decimal :fat_grams, precision: 10, scale: 2, null: false, default: 0
      t.decimal :carbs_grams, precision: 10, scale: 2, null: false, default: 0

      t.timestamps
    end

    add_index :food_logs, [ :user_id, :date ]
  end
end
