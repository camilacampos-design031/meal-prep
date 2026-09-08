# frozen_string_literal: true

class Recipe < ApplicationRecord
  belongs_to :user
  has_many :recipe_ingredients, dependent: :destroy

  SOURCES = %w[manual ai].freeze

  validates :name, presence: true
  validates :servings, numericality: { only_integer: true, greater_than: 0 }
  validates :source, inclusion: { in: SOURCES }
  validates :prep_time, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true

  def total_macros
    {
      calories:      recipe_ingredients.sum { |i| i.calories.to_f }.round(1),
      protein_grams: recipe_ingredients.sum { |i| i.protein_grams.to_f }.round(1),
      fat_grams:     recipe_ingredients.sum { |i| i.fat_grams.to_f }.round(1),
      carbs_grams:   recipe_ingredients.sum { |i| i.carbs_grams.to_f }.round(1)
    }
  end

  def per_serving_macros
    s = [servings.to_f, 1.0].max
    total_macros.transform_values { |v| (v / s).round(1) }
  end
end
