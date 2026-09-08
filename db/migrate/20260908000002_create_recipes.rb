# frozen_string_literal: true

class CreateRecipes < ActiveRecord::Migration[8.0]
  def change
    create_table :recipes do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.integer :servings, null: false, default: 1
      t.text :instructions
      t.integer :prep_time
      t.string :source, null: false, default: "manual"

      t.timestamps
    end
  end
end
