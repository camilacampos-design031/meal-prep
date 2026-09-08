# frozen_string_literal: true

class CreateMealSlots < ActiveRecord::Migration[8.0]
  def change
    create_table :meal_slots do |t|
      t.references :weekly_plan, null: false, foreign_key: true
      t.references :recipe, null: true, foreign_key: true
      t.integer :day_of_week, null: false
      t.string :meal_type, null: false

      t.timestamps
    end

    add_index :meal_slots, [ :weekly_plan_id, :day_of_week, :meal_type ], unique: true
  end
end
