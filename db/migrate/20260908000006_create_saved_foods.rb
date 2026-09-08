# frozen_string_literal: true

class CreateSavedFoods < ActiveRecord::Migration[8.0]
  def change
    create_table :saved_foods do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :reference_unit, null: false
      t.decimal :calories, precision: 10, scale: 2, null: false, default: 0
      t.decimal :protein_grams, precision: 10, scale: 2, null: false, default: 0
      t.decimal :fat_grams, precision: 10, scale: 2, null: false, default: 0
      t.decimal :carbs_grams, precision: 10, scale: 2, null: false, default: 0

      t.timestamps
    end
  end
end
