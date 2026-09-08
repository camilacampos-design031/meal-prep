# frozen_string_literal: true

class CreateGroceryLists < ActiveRecord::Migration[8.0]
  def change
    create_table :grocery_lists do |t|
      t.references :weekly_plan, null: false, foreign_key: true, index: { unique: true }

      t.timestamps
    end
  end
end
