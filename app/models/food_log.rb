# frozen_string_literal: true

class FoodLog < ApplicationRecord
  belongs_to :user
  belongs_to :saved_food, optional: true

  MEAL_TYPES = %w[breakfast lunch dinner other].freeze

  validates :date, :description, presence: true
  validates :meal_type, inclusion: { in: MEAL_TYPES }, allow_nil: true
  validates :calories, :protein_grams, :fat_grams, :carbs_grams,
            numericality: { greater_than_or_equal_to: 0 }
end
