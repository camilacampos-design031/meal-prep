# frozen_string_literal: true

class CreateGroceryListItems < ActiveRecord::Migration[8.0]
  def change
    create_table :grocery_list_items do |t|
      t.references :grocery_list, null: false, foreign_key: true
      t.string :ingredient_name, null: false
      t.decimal :total_quantity, precision: 10, scale: 2, null: false
      t.string :unit, null: false
      t.boolean :checked, null: false, default: false

      t.timestamps
    end
  end
end
