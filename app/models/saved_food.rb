# frozen_string_literal: true

class SavedFood < ApplicationRecord
  belongs_to :user
  has_many :food_logs, dependent: :nullify

  validates :name, :reference_unit, presence: true
  validates :calories, :protein_grams, :fat_grams, :carbs_grams,
            numericality: { greater_than_or_equal_to: 0 }
end
