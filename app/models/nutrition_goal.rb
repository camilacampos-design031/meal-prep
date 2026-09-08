# frozen_string_literal: true

class NutritionGoal < ApplicationRecord
  belongs_to :user

  validates :protein_grams, :fat_grams, :carbs_grams, presence: true,
            numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  before_save :compute_calories

  private

  def compute_calories
    self.calories = (protein_grams * 4) + (fat_grams * 9) + (carbs_grams * 4)
  end
end
