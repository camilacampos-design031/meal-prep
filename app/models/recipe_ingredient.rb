# frozen_string_literal: true

class RecipeIngredient < ApplicationRecord
  belongs_to :recipe

  validates :food_name, presence: true
  validates :quantity, numericality: { greater_than: 0 }
  validates :unit, presence: true
  validates :calories, :protein_grams, :fat_grams, :carbs_grams,
            numericality: { greater_than_or_equal_to: 0 }
end
